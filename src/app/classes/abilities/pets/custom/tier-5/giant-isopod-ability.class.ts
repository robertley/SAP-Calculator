import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GiantIsopodAbility extends Ability {
    private logService: LogService;
    private triggerCount = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Giant Isopod Ability',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const baseHealth = [2, 4, 6][Math.min(Math.max(this.level - 1, 0), 2)];
        const extra = Math.floor(this.triggerCount / 2);
        const healthGain = baseHealth + extra;

        const friends = owner.parent.petArray.filter((friend) => friend && friend.alive && friend !== owner);
        for (const friend of friends) {
            friend.increaseHealth(healthGain);
        }

        this.logService.createLog({
            message: `${owner.name} gave ${friends.length} friends +${healthGain} health.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        if (owner.parent.trumpets >= 2) {
            owner.parent.spendTrumpets(2, owner);
        }

        this.triggerCount++;
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GiantIsopodAbility {
        return new GiantIsopodAbility(newOwner, this.logService);
    }
}
