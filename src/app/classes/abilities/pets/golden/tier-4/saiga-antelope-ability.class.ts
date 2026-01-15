import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class SaigaAntelopeAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'SaigaAntelopeAbility',
            owner: owner,
            triggers: ['FriendDied2'],
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
        const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
        trumpetTargetResp.player.gainTrumpets(this.level * 3, owner, pteranodon, undefined, undefined, trumpetTargetResp.random);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SaigaAntelopeAbility {
        return new SaigaAntelopeAbility(newOwner, this.logService, this.abilityService);
    }
}
