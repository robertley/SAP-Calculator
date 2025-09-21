import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PugAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'PugAbility',
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

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        let power = this.level;
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} exp.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        });
        target.increaseExp(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): PugAbility {
        return new PugAbility(newOwner, this.logService);
    }
}