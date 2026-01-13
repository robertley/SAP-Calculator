import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AmphisbaenaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AmphisbaenaAbility',
            owner: owner,
            triggers: ['EndTurn'],
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
        
        const { gameApi, tiger, pteranodon } = context;
        const owner = this.owner;

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];

        const turnNumber = gameApi?.turnNumber ?? 1;
        if (turnNumber % 2 === 1) {
            target.increaseAttack(this.level);
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${this.level} attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsAheadResp.random
            });
        } else {
            target.increaseHealth(this.level);
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${this.level} health.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsAheadResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AmphisbaenaAbility {
        return new AmphisbaenaAbility(newOwner, this.logService);
    }
}
