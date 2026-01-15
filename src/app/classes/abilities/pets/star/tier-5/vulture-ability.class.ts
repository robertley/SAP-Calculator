import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class VultureAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'VultureAbility',
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

        let opponent = owner.parent.opponent;
        let targetResp = opponent.getRandomPet([], false, true, false, owner);
        if (targetResp.pet == null) {
            return;
        }
        let power = this.level * 4;
        owner.snipePet(targetResp.pet, power, targetResp.random, tiger);
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): VultureAbility {
        return new VultureAbility(newOwner, this.logService, this.abilityService);
    }
}
