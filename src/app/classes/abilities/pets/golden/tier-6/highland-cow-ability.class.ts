import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class HighlandCowAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'HighlandCowAbility',
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

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        const trumpetAmt = (this.level * 4) + (Math.floor(owner.health / 3) * this.level);
        const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
        trumpetTargetResp.player.gainTrumpets(trumpetAmt, owner, pteranodon, undefined, undefined, trumpetTargetResp.random);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HighlandCowAbility {
        return new HighlandCowAbility(newOwner, this.logService);
    }
}
