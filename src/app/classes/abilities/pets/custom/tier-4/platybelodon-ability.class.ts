import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PlatybelodonAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PlatybelodonAbility',
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

        // Get roll amount from gameApi
        let rollAmount = 0;

        // Determine if this is player's pet or opponent's pet and get appropriate roll count
        if (owner.parent === gameApi.player) {
            rollAmount = gameApi.playerRollAmount || 0;
        } else if (owner.parent === gameApi.opponet) {
            rollAmount = gameApi.opponentRollAmount || 0;
        }

        let trumpetsGained = this.level * Math.min(rollAmount, 8);

        if (trumpetsGained > 0) {
            const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
            trumpetTargetResp.player.gainTrumpets(trumpetsGained, owner, tiger, undefined, undefined, trumpetTargetResp.random);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PlatybelodonAbility {
        return new PlatybelodonAbility(newOwner, this.logService);
    }
}
