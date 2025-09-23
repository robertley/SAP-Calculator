import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Weak } from "../../../../equipment/ailments/weak.class";

export class MicrobeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MicrobeAbility',
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

        let targetsResp = owner.parent.getAll(true, owner);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let pet of targets) {
            if (!pet.alive) {
                continue;
            }
            this.logService.createLog({
                message: `${owner.name} gave ${pet.name} Weak.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
            pet.givePetEquipment(new Weak());
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): MicrobeAbility {
        return new MicrobeAbility(newOwner, this.logService);
    }
}