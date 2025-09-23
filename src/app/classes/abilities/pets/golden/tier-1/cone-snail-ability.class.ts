import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ConeSnailAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ConeSnailAbility',
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

        let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        let target = targetsBehindResp.pets[0];
        let power = this.level * 2;
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetsBehindResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ConeSnailAbility {
        return new ConeSnailAbility(newOwner, this.logService);
    }
}