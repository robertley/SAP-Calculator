import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class HorseAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'HorseAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
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

        // Use ability level - Tiger system will override this.level during second execution
        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        if (targetResp.pet == null) {
            return;
        }

        targetResp.pet.increaseAttack(this.level);
        this.logService.createLog({
            message: `${owner.name} gave ${triggerPet.name} ${this.level} attack`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HorseAbility {
        return new HorseAbility(newOwner, this.logService);
    }
}