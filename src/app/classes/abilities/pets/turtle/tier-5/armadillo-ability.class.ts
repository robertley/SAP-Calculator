import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ArmadilloAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ArmadilloAbility',
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

        let targetsResp = owner.parent.getAll(true, owner);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            let power = 8 * this.level;
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${owner.name} increased health of ${pet.name} by ${power}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ArmadilloAbility {
        return new ArmadilloAbility(newOwner, this.logService);
    }
}