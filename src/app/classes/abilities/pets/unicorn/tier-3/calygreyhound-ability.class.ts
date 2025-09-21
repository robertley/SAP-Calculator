import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class CalygreyhoundAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CalygreyhoundAbility',
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

        if (owner.mana == 0) {
            return;
        }

        let targetsResp = owner.parent.opponent.getHighestHealthPets(2, undefined, owner);
        let power = this.level * owner.mana;

        for (let target of targetsResp.pets) {
            target.health = Math.max(1, target.health - power);
            this.logService.createLog({
                message: `${owner.name} reduced ${target.name}'s health by ${power} (${target.health}).`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            });
        }

        owner.mana = 0;

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): CalygreyhoundAbility {
        return new CalygreyhoundAbility(newOwner, this.logService);
    }
}