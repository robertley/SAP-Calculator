import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { Weak } from "app/classes/equipment/ailments/weak.class";

export class ToiletPaperAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ToiletPaperAbility',
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
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Toilet Paper toy behavior
        let opponent = owner.parent.opponent;
        let excludePets = opponent.getPetsWithEquipment('Weak');
        let targetResp = opponent.getFurthestUpPets(this.level, excludePets, owner);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            pet.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} Weak.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            })
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ToiletPaperAbility {
        return new ToiletPaperAbility(newOwner, this.logService);
    }
}