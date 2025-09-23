import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PhilippineEagleAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PhilippineEagleAbility',
            owner: owner,
            triggers: ['AnyoneJumped'],
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

        let targetResp = owner.parent.getRandomPet([owner], false, false, false, owner);
        let target = targetResp.pet;
        if (!target) {
            return;
        }

        let buffAmount = this.level * 4;

        target.increaseAttack(buffAmount);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${buffAmount} attack`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        target.increaseHealth(buffAmount);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${buffAmount} health`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PhilippineEagleAbility {
        return new PhilippineEagleAbility(newOwner, this.logService);
    }
}