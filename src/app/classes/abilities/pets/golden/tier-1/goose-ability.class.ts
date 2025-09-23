import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GooseAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GooseAbility',
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
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        let power = this.level;
        target.increaseAttack(-this.level);
        this.logService.createLog({
            message: `${owner.name} removed ${power} attack from ${target.name}.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): GooseAbility {
        return new GooseAbility(newOwner, this.logService);
    }
}