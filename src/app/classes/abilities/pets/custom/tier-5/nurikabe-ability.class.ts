import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
export class NurikabeAbility extends Ability {

    constructor(owner: Pet) {
        super({
            name: 'NurikabeAbility',
            owner: owner,
            triggers: [],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
    }

    private executeAbility(context: AbilityContext): void {
    }

    reset(): void {
        this.maxUses = this.level;
        super.reset();
    }
    copy(newOwner: Pet): NurikabeAbility {
        return new NurikabeAbility(newOwner);
    }
}