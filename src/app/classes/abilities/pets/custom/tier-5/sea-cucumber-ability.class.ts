import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Tasty } from "../../../../equipment/ailments/tasty.class";

export class SeaCucumberAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'SeaCucumberAbility',
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
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let excludePets = owner.parent.opponent.getPetsWithEquipment('Toasty');
        let targetResp = owner.parent.opponent.getRandomPets(this.level, excludePets, false, true, owner);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            let tasty = new Tasty(this.logService, this.abilityService);
            target.givePetEquipment(tasty);
            this.logService.createLog({
                message: `${owner.name} made ${target.name} Tasty`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SeaCucumberAbility {
        return new SeaCucumberAbility(newOwner, this.logService, this.abilityService);
    }
}