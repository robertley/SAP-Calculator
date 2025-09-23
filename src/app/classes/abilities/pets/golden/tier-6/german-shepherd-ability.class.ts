import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GermanShepherdAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GermanShepherdAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
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

        let power = Math.floor(owner.attack * owner.level * 0.25);
        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (!target) {
            return;
        }

        target.increaseAttack(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): GermanShepherdAbility {
        return new GermanShepherdAbility(newOwner, this.logService);
    }
}