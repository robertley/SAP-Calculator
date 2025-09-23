import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SilkmothAbility extends Ability {
    private logService: LogService;
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SilkmothAbility',
            owner: owner,
            triggers: ['FriendAheadHurt'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        let power = this.level;
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SilkmothAbility {
        return new SilkmothAbility(newOwner, this.logService);
    }
}