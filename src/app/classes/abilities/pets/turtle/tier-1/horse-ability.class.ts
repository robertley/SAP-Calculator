import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { logAbility, resolveFriendSummonedTarget } from "../../../ability-helpers";

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
        const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
        if (!targetResp.pet) {
            return;
        }

        const target = targetResp.pet;
        target.increaseAttack(this.level);
        logAbility(
            this.logService,
            owner,
            `${owner.name} gave ${target.name} ${this.level} attack`,
            tiger,
            pteranodon,
            { randomEvent: targetResp.random }
        );

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HorseAbility {
        return new HorseAbility(newOwner, this.logService);
    }
}
