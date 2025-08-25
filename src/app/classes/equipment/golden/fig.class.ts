import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Fig extends Equipment {
    name = 'Fig';
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
            if (pet.equipment != this) {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let opponent = pet.parent == gameApi.player ? gameApi.opponet : gameApi.player;
                let attackPet = opponent.getLowestHealthPet().pet;
                if (attackPet == null) {
                    console.warn("fig didn't find target");
                    return;
                }
                
                // Use proper snipePet method with equipment=true flag  
                pet.snipePet(attackPet, 4, true, false, false, true, false);
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