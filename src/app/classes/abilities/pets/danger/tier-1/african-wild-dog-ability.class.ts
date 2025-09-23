import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AfricanWildDogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AfricanWildDogAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        let targetResp = owner.parent.opponent.getFurthestUpPet(owner);
        if (targetResp.pet == null) {
            return
        }
        let target: Pet;
        if (targetResp.random) {
            target = targetResp.pet;
        } else {
            target = targetResp.pet?.petBehind();
        }

        if (target) {
            let damage = this.level * 3;
            owner.jumpAttackPrep(target)
            owner.jumpAttack(target, tiger, damage, targetResp.random);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AfricanWildDogAbility {
        return new AfricanWildDogAbility(newOwner, this.logService);
    }
}