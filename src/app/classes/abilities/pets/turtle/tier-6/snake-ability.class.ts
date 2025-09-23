import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { getOpponent } from "app/util/helper-functions";

export class SnakeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SnakeAbility',
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

        let power = this.level * 5;
        let targetResp = owner.parent.opponent.getRandomPet([], false, true, false, owner);
        if (!targetResp.pet) {
            return;
        }
        owner.snipePet(targetResp.pet, power, targetResp.random, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SnakeAbility {
        return new SnakeAbility(newOwner, this.logService);
    }
}