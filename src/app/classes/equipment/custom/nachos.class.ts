import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Nachos extends Equipment {
    name = 'Nachos';
    tier = 1;
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        let originalBeforeAttack = pet.beforeAttack?.bind(pet);
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
            
            // Calculate how much health can be converted (up to 3, but don't kill pet)
            let maxConversion = 3;
            let availableHealth = pet.health - 1; // Keep pet alive (minimum 1 health)
            let conversionAmount = Math.min(maxConversion, availableHealth);
            
            // Only convert if there's health to convert
            if (conversionAmount > 0) {
                // Convert health to attack
                pet.increaseHealth(-conversionAmount);
                pet.increaseAttack(conversionAmount);
                
                this.logService.createLog({
                    message: `${pet.name} converted ${conversionAmount} health into ${conversionAmount} attack (Nachos)`,
                    type: 'equipment',
                    player: pet.parent
                });
            }
            
            // Remove equipment after use
            pet.removePerk();
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService 
    ) {
        super();
    }
}