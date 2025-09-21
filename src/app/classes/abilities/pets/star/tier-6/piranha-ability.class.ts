import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PiranhaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PiranhaAbility',
            owner: owner,
            triggers: ['ThisHurt'],
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

        let targetPetsResp = owner.parent.getAll(false, owner, true);
        let targetPets = targetPetsResp.pets;
        let power = this.level * 3;
        for (let target of targetPets) {
            target.increaseAttack(power);
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${power} attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetPetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PiranhaAbility {
        return new PiranhaAbility(newOwner, this.logService);
    }
}