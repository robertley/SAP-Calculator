import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BunyipAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BunyipAbility',
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

        let isPlayer = owner.parent == gameApi.player;
        let rollAmount;
        if (isPlayer) {
            rollAmount = gameApi.playerRollAmount;
        } else {
            rollAmount = gameApi.opponentRollAmount;
        }
        rollAmount = Math.min(this.level * 2, rollAmount);
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        target.increaseHealth(rollAmount);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${rollAmount} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BunyipAbility {
        return new BunyipAbility(newOwner, this.logService);
    }
}