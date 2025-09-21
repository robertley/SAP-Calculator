import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PeacockAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PeacockAbility',
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

        let boost = this.level * 3;
        let selfTargetResp = owner.parent.getThis(owner);
        if (selfTargetResp.pet) {
            selfTargetResp.pet.increaseAttack(boost);
            this.logService.createLog({
                message: `${owner.name} gave ${selfTargetResp.pet.name} ${boost} attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: selfTargetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PeacockAbility {
        return new PeacockAbility(newOwner, this.logService);
    }
}