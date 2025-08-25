import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Nest } from "../../pets/hidden/nest.class";

export class Egg extends Equipment {
    name = 'Egg';
    tier = 1;
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack =pet.beforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi, tiger) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            // Check if equipment is still equipped
            if (pet.equipment !== this) {
                return;
            }
            
            let multiplier = 1;
            // Special case: Nest with Egg triggers multiple times based on Nest level
            if (pet instanceof Nest) {
                multiplier = pet.level;
            } else {
                multiplier = this.multiplier;
            }
            
            for (let i = 0; i < multiplier; i++) {
                let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
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
                pet.snipePet(attackPet, 2, false, false, false, true, false);
            }
            
            // Remove equipment after use
            pet.removePerk();
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super()
    }
}