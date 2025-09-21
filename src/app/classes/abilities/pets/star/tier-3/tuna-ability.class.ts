import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TunaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TunaAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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

        let totalHurt = owner.timesHurt;
        for (let i = 0; i < totalHurt; i++) {
            const targetResp = owner.parent.getRandomPet([owner], true, false, true, owner);

            if (targetResp.pet == null) {
                continue;
            }

            const buffAmount = this.level;

            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} +${buffAmount} attack and +${buffAmount} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            targetResp.pet.increaseAttack(buffAmount);
            targetResp.pet.increaseHealth(buffAmount);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TunaAbility {
        return new TunaAbility(newOwner, this.logService);
    }
}