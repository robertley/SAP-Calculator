import { Ability, AbilityContext } from "../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

export class ButterflyAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ButterflyAbility',
            owner: owner,
            triggers: ['ThisTransformed'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        if (!owner.alive) {
            return;
        }

        let opponent = owner.parent.opponent;
        let targetResp = opponent.getStrongestPet(owner);
        if (!targetResp.pet) {
            return;
        }

        owner.health = targetResp.pet.health;
        owner.attack = targetResp.pet.attack;
        this.logService.createLog({
            message: `${owner.name} copied stats from the strongest enemy (${owner.attack}/${owner.health}).`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ButterflyAbility {
        return new ButterflyAbility(newOwner, this.logService);
    }
}