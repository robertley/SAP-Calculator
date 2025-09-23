import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class MinotaurAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MinotaurAbility',
            owner: owner,
            triggers: ['FriendAheadAttacked'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        if (!triggerPet) {
            return;
        }

        let power = this.level * triggerPet.level;
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        })
        target.increaseAttack(power);
        target.increaseHealth(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): MinotaurAbility {
        return new MinotaurAbility(newOwner, this.logService);
    }
}