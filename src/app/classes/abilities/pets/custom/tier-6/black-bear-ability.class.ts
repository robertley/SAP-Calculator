import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BlackBearAbility extends Ability {
    private logService: LogService;
    private foodsEatenThisTurn = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Black Bear Ability',
            owner: owner,
            triggers: ['StartTurn', 'FoodEatenByThis', 'ThisDied'],
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
            this.foodsEatenThisTurn = 0;
            return;
        }

        if (context.trigger === 'FoodEatenByThis') {
            this.foodsEatenThisTurn++;
            return;
        }

        if (context.trigger === 'ThisDied') {
            const damagePerFood = this.level * 4;
            const totalDamage = damagePerFood * this.foodsEatenThisTurn;
            if (totalDamage <= 0) {
                this.triggerTigerExecution(context);
                return;
            }

            const targetResp = owner.parent.opponent.getRandomPets(1, [], false, true, owner);
            const target = targetResp.pets[0];
            if (!target) {
                this.triggerTigerExecution(context);
                return;
            }

            owner.dealDamage(target, totalDamage);

            this.logService.createLog({
                message: `${owner.name} dealt ${totalDamage} damage to ${target.name} after eating ${this.foodsEatenThisTurn} food item${this.foodsEatenThisTurn === 1 ? '' : 's'}.`,
                type: 'ability',
                player: owner.parent,
                tiger: context.tiger,
                pteranodon: context.pteranodon,
                randomEvent: targetResp.random
            });
            this.triggerTigerExecution(context);
        }
    }

    copy(newOwner: Pet): BlackBearAbility {
        return new BlackBearAbility(newOwner, this.logService);
    }
}
