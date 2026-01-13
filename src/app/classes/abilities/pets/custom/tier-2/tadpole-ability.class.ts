import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { Frog } from "../../../../pets/star/tier-1/frog.class";
import { levelToExp } from "../../../../../util/leveling";

export class TadpoleAbility extends Ability {
    constructor(owner: Pet) {
        super({
            name: 'Tadpole Ability',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi } = context;
        const owner = this.owner;
        const level = owner.level;

        // Create a new Frog
        const frog = (gameApi as any).petService.createPet('Frog', owner.parent, levelToExp(level));

        if (frog) {
            // Transformation
            owner.parent.transformPet(owner, frog);

            (gameApi as any).logService.createLog({
                message: `${owner.name} transformed into a level ${level} Frog.`,
                type: 'ability',
                player: owner.parent
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): TadpoleAbility {
        return new TadpoleAbility(newOwner);
    }
}
