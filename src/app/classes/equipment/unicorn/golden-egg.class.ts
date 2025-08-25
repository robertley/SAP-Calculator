import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class GoldenEgg extends Equipment {
    name = 'Golden Egg';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment !== this) {
                return;
            }
            
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
                console.warn("golden egg didn't find target");
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                // Use proper snipePet method which handles all the damage logic correctly
                pet.snipePet(attackPet, 6, false, false, false, true, false);
            }
            
            // Remove equipment after use
            pet.removePerk();
        }
    }
    

    constructor(private logService: LogService, private abilityService: AbilityService) {
        super();
    }
}