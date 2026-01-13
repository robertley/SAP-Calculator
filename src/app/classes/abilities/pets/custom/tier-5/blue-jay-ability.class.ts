import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { shuffle } from "app/util/helper-functions";

export class BlueJayAbility extends Ability {
    private logService: LogService;
    private foodsEatenThisTurn = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Blue Jay Ability',
            owner: owner,
            triggers: ['FoodEatenByThis', 'StartTurn', 'ThisDied'],
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
            const buffPerFood = this.level;
            const totalBuff = buffPerFood * this.foodsEatenThisTurn;
            if (totalBuff <= 0) {
                this.triggerTigerExecution(context);
                return;
            }

            const friends = owner.parent.petArray
                .filter((friend) => friend && friend !== owner && friend.alive);

            if (friends.length === 0) {
                this.triggerTigerExecution(context);
                return;
            }

            shuffle(friends);
            const targets = friends.slice(0, 3);

            for (const target of targets) {
                target.increaseAttack(totalBuff);
                target.increaseHealth(totalBuff);
            }

            this.logService.createLog({
                message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${totalBuff}/+${totalBuff} after fainting.`,
                type: 'ability',
                player: owner.parent,
                tiger: context.tiger,
                pteranodon: context.pteranodon
            });
            this.triggerTigerExecution(context);
        }
    }

    copy(newOwner: Pet): BlueJayAbility {
        return new BlueJayAbility(newOwner, this.logService);
    }
}
