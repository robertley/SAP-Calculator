import { Ability, AbilityContext } from "../../../../ability.class";
import { AbilityService } from "app/services/ability.service";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Player } from "../../../../player.class";

export class PonyAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Pony Ability',
            owner: owner,
            triggers: ['ThisKilledEnemy'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const player = owner.parent;
        const apples = this.level;
        const target = this.getBackMostFriend(player);

        if (!target) {
            this.triggerTigerExecution(context);
            return;
        }

        const abilityService = (player as any).abilityService as AbilityService;

        for (let i = 0; i < apples; i++) {
            this.applyApple(target, abilityService);
        }

        this.logService.createLog({
            message: `${owner.name} fed ${target.name} ${apples} apple${apples === 1 ? '' : 's'} after knocking out an enemy.`,
            type: 'ability',
            player: player,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    private applyApple(target: Pet, abilityService?: AbilityService): void {
        target.increaseAttack(1);
        target.increaseHealth(1);
        abilityService?.triggerFoodEvents(target, 'apple');
    }

    private getBackMostFriend(player: Player): Pet | null {
        for (let i = player.petArray.length - 1; i >= 0; i--) {
            const friend = player.petArray[i];
            if (friend && friend.alive && friend !== this.owner) {
                return friend;
            }
        }
        return null;
    }

    override copy(newOwner: Pet): PonyAbility {
        return new PonyAbility(newOwner, this.logService);
    }
}
