import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";

export class FairyAbility extends Ability {
    constructor(owner: Pet) {
        super({
            name: 'FairyAbility',
            owner: owner,
            triggers: [],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
    }

    private executeAbility(context: AbilityContext): void {
    }

    copy(newOwner: Pet): FairyAbility {
        return new FairyAbility(newOwner);
    }
}