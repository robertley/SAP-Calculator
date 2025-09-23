import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PoisonDartFrogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PoisonDartFrogAbility',
            owner: owner,
            triggers: ['FriendAheadDied'],
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

        let highestHealthResp = owner.parent.opponent.getHighestHealthPet(undefined, owner);
        let target = highestHealthResp.pet;
        if (target == null) {
            return;
        }

        owner.snipePet(target, 4 * owner.level, highestHealthResp.random, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PoisonDartFrogAbility {
        return new PoisonDartFrogAbility(newOwner, this.logService);
    }
}