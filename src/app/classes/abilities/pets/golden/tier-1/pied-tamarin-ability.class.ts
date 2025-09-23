import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PiedTamarinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PiedTamarinAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                return owner.parent.trumpets >= 1;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetsResp = owner.parent.opponent.getRandomPets(this.level, null, null, true, owner);
        for (let target of targetsResp.pets) {
            if (target != null) {
                owner.snipePet(target, 3, targetsResp.random, tiger, pteranodon);
            }
        }
        if (targetsResp.pets.length > 0) {
            owner.parent.spendTrumpets(1, owner, pteranodon);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PiedTamarinAbility {
        return new PiedTamarinAbility(newOwner, this.logService);
    }
}