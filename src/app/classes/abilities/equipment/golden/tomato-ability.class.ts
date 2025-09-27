import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";

export class TomatoAbility extends Ability {
    private equipment: Equipment;

    constructor(owner: Pet, equipment: Equipment) {
        super({
            name: 'TomatoAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Tomato is removed after one use
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

        for (let i = 0; i < multiplier; i++) {
            let targetResp = owner.parent.opponent.getLastPet();
            if (targetResp.pet == null) {
                break;
            }

            // Use proper snipePet method which handles all the damage logic correctly
            owner.snipePet(targetResp.pet, 10, targetResp.random, false, false, true, false);
        }

        // Remove equipment after use
        owner.removePerk();
    }
}