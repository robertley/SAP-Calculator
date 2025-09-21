import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class WolverineAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'WolverineAbility',
            owner: owner,
            triggers: ['FriendHurt4'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        let targetResp = owner.parent.opponent.getAll(false, owner);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let targetPet of targets) {
            let power = -3 * this.level;
            targetPet.increaseHealth(power);
            this.logService.createLog({
                message: `${owner.name} reduced ${targetPet.name} health by ${Math.abs(power)}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WolverineAbility {
        return new WolverineAbility(newOwner, this.logService, this.abilityService);
    }
}