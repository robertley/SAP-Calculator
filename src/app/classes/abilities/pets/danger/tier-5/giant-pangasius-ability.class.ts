import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GiantPangasiusAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GiantPangasiusAbility',
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

        if (!gameApi) {
            return;
        }

        // Use the correct transformation amount based on which player this pet belongs to
        let transformations: number;
        if (owner.parent === gameApi.player) {
            transformations = gameApi.playerTransformationAmount;
        } else {
            transformations = gameApi.opponentTransformationAmount;
        }

        let damage = this.level * 4; // 4/8/12 damage per level

        if (transformations > 0) {
            for (let i = 0; i < transformations; i++) {
                let targetResp = owner.parent.opponent.getRandomPet([], false, true, false, owner);
                if (targetResp.pet) {
                    owner.snipePet(targetResp.pet, damage, targetResp.random, tiger);
                }
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): GiantPangasiusAbility {
        return new GiantPangasiusAbility(newOwner, this.logService);
    }
}