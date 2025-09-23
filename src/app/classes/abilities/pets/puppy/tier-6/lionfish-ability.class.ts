import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LionfishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LionfishAbility',
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

        let opponent = owner.parent.opponent;
        let snipeAmt = 1 + Math.floor(owner.attack / 10);
        for (let i = 0; i < snipeAmt; i++) {
            let targetResp = opponent.getRandomPet([], false, true, false, owner);
            if (targetResp.pet == null) {
                return;
            }
            let power = this.level * 3;
            owner.snipePet(targetResp.pet, power, targetResp.random, tiger, pteranodon);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): LionfishAbility {
        return new LionfishAbility(newOwner, this.logService);
    }
}