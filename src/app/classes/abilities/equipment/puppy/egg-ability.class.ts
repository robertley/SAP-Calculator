import { Ability, AbilityContext } from "../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { Nest } from "../../../pets/hidden/nest.class";

export class EggAbility extends Ability {
    private equipment: Equipment;

    constructor(owner: Pet, equipment: Equipment) {
        super({
            name: 'EggAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Equipment',
            native: true, 
            maxUses: 1, // Egg is removed after one use
            abilitylevel: 1,
            condition: (context: AbilityContext) => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                // Check if equipment is still equipped
                return owner.equipment === this.equipment;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        if (tiger) {
            return;
        }

        let multiplier = this.equipment.multiplier;
        // Special case: Nest with Egg triggers multiple times based on level
        if (owner instanceof Nest) {
            // Use triggerPet level if triggered by Tiger, otherwise use owner level
            const effectiveLevel = triggerPet?.name === 'Tiger' ? triggerPet.level : owner.level;
            multiplier += effectiveLevel - 1;
        }

        for (let i = 0; i < multiplier; i++) {
            let opponent = owner.parent == gameApi.player ? gameApi.opponet : gameApi.player;
            let opponentPets = opponent.petArray;
            let attackPet: Pet = null;
            for (let opponentPet of opponentPets) {
                if (opponentPet.alive) {
                    attackPet = opponentPet;
                    break;
                }
            }

            if (attackPet == null) {
                console.warn("egg didn't find target");
                continue;
            }

            // Use proper snipePet method which handles all the damage logic correctly
            owner.snipePet(attackPet, 2, false, false, false, true, false);
        }

        // Remove equipment after use
        owner.removePerk();
    }
}