import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";

export class CherryAbility extends Ability {
    private equipment: Equipment;

    constructor(owner: Pet, equipment: Equipment) {
        super({
            name: 'CherryAbility',
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
        const owner = this.owner;

        let multiplier = this.equipment.multiplier;
        owner.parent.gainTrumpets(2 * multiplier, owner, false, multiplier, true);
    }
}