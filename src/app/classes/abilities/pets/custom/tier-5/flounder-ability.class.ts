import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class FlounderAbility extends Ability {
    private logService: LogService;
    private foodsEaten = 0;
    private triggeredThisTurn = false;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Flounder Ability',
            owner: owner,
            triggers: ['FoodEatenByThis', 'StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        if (context.trigger === 'StartTurn') {
            this.foodsEaten = 0;
            this.triggeredThisTurn = false;
            this.triggerTigerExecution(context);
            return;
        }

        if (this.triggeredThisTurn) {
            this.triggerTigerExecution(context);
            return;
        }

        this.foodsEaten++;

        if (this.foodsEaten < 2) {
            this.triggerTigerExecution(context);
            return;
        }

        const expGain = this.level;
        const targetsResp = owner.parent.nearestPetsBehind(2, owner);
        for (const target of targetsResp.pets) {
            target.increaseExp(expGain);
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${expGain} exp.`,
                type: 'ability',
                player: owner.parent,
                tiger: context.tiger,
                pteranodon: context.pteranodon,
                randomEvent: targetsResp.random
            });
        }

        this.triggeredThisTurn = true;
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FlounderAbility {
        return new FlounderAbility(newOwner, this.logService);
    }
}
