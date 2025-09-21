import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class KangarooAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'KangarooAbility',
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
        let selfTargetResp = owner.parent.getThis(owner);
        if (selfTargetResp.pet) {
            selfTargetResp.pet.increaseAttack(this.level);
            selfTargetResp.pet.increaseHealth(this.level);
            this.logService.createLog({
                message: `${owner.name} gave ${selfTargetResp.pet.name} ${this.level} attack and ${this.level} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: selfTargetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): KangarooAbility {
        return new KangarooAbility(newOwner, this.logService);
    }
}