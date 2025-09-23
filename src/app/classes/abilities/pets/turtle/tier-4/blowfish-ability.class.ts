import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { getOpponent } from "app/util/helper-functions";

export class BlowfishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BlowfishAbility',
            owner: owner,
            triggers: ['ThisHurt'],
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

        let power = this.level * 3;
        let targetResp = owner.parent.opponent.getRandomPet([], false, true, false, owner);
        if (targetResp.pet) {
            owner.snipePet(targetResp.pet, power, targetResp.random, tiger);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BlowfishAbility {
        return new BlowfishAbility(newOwner, this.logService);
    }
}