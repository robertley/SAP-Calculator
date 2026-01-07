import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";

export class WalnutAbility extends Ability {
    private equipment: Equipment;

    constructor(owner: Pet, equipment: Equipment) {
        super({
            name: 'WalnutAbility',
            owner: owner,
            triggers: ['BeforeStartBattle'],
            abilityType: 'Equipment',
            native: true,
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
    }

    private executeAbility(context: AbilityContext): void {
        // Walnut is passive defense equipment - integrated into damage system
        // No explicit action needed here
        return;
    }
}

