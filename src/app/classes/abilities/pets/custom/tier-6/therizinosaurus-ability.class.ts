import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Coconut } from "../../../../equipment/turtle/coconut.class";

export class TherizinosaurusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TherizinosaurusAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let excludePets = owner.parent.getPetsWithoutEquipment('Strawberry');
        let targetsResp = owner.parent.getFurthestUpPets(this.level, excludePets, owner);
        let targets = targetsResp.pets;
        for (let pet of targets) {
            pet.givePetEquipment(new Coconut());
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} Coconut.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TherizinosaurusAbility {
        return new TherizinosaurusAbility(newOwner, this.logService);
    }
}