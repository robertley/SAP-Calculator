import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";

export class GoldenEggAbility extends Ability {
    private equipment: Equipment;

    constructor(owner: Pet, equipment: Equipment) {
        super({
            name: 'GoldenEggAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Golden Egg is removed after one use
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;

        let opponentPets = owner.parent.opponent.petArray;
        let attackPet: Pet = null;
        for (let opponentPet of opponentPets) {
            if (opponentPet.alive) {
                attackPet = opponentPet;
                break;
            }
        }

        if (attackPet == null) {
            return;
        }

        let multiplier = this.equipment.multiplier;

        for (let i = 0; i < multiplier; i++) {
            // Use proper snipePet method which handles all the damage logic correctly
            owner.snipePet(attackPet, 6, false, false, false, true, false);
        }

        // Remove equipment after use
        owner.removePerk();
    }
}