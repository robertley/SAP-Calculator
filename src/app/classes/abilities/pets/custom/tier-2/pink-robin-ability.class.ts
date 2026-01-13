import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";

export class PinkRobinAbility extends Ability {
    constructor(owner: Pet) {
        super({
            name: 'Pink Robin Ability',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
    }

    private executeAbility(context: AbilityContext): void {
        const gameApi = context.gameApi;
        const maxTier = this.level * 2;

        const friends = this.owner.parent.petArray.filter(p =>
            p.alive &&
            p !== this.owner &&
            p.tier <= maxTier
        );

        if (friends.length > 0) {
            const randomIndex = Math.floor(Math.random() * friends.length);
            const target = friends[randomIndex];

            // Activate End Turn on the target
            (gameApi as any).abilityService.triggerAbility(target, 'EndTurn', this.owner);

            (gameApi as any).logService.createLog({
                message: `${this.owner.name} activated End Turn on ${target.name}.`,
                type: 'ability',
                player: this.owner.parent
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): PinkRobinAbility {
        return new PinkRobinAbility(newOwner);
    }
}
