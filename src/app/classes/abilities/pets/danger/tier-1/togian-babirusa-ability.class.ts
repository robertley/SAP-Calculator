import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TogianBabirusaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TogianBabirusaAbility',
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

        let targetResp = owner.parent.opponent.getRandomPet([], false, false, false, owner);

        if (targetResp.pet) {  // getRandomPet returns null if no living pets
            targetResp.pet.increaseAttack(1);  // Fixed +1, not this.level * 1
            targetResp.pet.increaseHealth(1);  // Fixed +1, not this.level * 1

            this.logService.createLog({
                message: `${owner.name} gave ${targetResp.pet.name} +1 attack and +1 health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TogianBabirusaAbility {
        return new TogianBabirusaAbility(newOwner, this.logService);
    }
}