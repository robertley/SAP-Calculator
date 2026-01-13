import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class RootlingAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Rootling Ability',
            owner: owner,
            triggers: ['EndTurn'],
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
        const amount = this.level;

        const candidates = owner.parent.petArray
            .filter((friend) => friend && friend.alive && friend !== owner && friend.health < owner.health)
            .sort((a, b) => (a.health - b.health));

        const targets = candidates.slice(0, 2);

        for (const target of targets) {
            target.increaseAttack(amount);
            target.increaseHealth(amount);
        }

        if (targets.length > 0) {
            this.logService.createLog({
                message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${amount}/+${amount}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): RootlingAbility {
        return new RootlingAbility(newOwner, this.logService);
    }
}
