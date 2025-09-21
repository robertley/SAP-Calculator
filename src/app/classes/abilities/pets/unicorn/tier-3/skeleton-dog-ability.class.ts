import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SkeletonDogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SkeletonDogAbility',
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

        let targetsResp = owner.parent.getRandomPets(this.level, [owner], true, false, owner);
        for (let target of targetsResp.pets) {
            if (target != null) {
                this.logService.createLog({
                    message: `${owner.name} gave ${1} attack and ${1} health to ${target.name}.`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    randomEvent: targetsResp.random
                });

                target.increaseAttack(1);
                target.increaseHealth(1);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SkeletonDogAbility {
        return new SkeletonDogAbility(newOwner, this.logService);
    }
}