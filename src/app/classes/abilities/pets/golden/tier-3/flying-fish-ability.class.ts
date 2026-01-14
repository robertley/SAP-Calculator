import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { awardExperienceWithLog } from "../../../ability-effects";
import { resolveFriendSummonedTarget } from "../../../ability-helpers";

export class FlyingFishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FlyingFishAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        const power = this.level * 2;
        const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
        if (!targetResp.pet) {
            return;
        }

        awardExperienceWithLog({
            logService: this.logService,
            owner,
            context,
            target: targetResp.pet,
            amount: power,
            extras: { randomEvent: targetResp.random }
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FlyingFishAbility {
        return new FlyingFishAbility(newOwner, this.logService);
    }
}
