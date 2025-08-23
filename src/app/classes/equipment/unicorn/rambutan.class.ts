import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Rambutan extends Equipment {
    name = 'Rambutan';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet) => {
        let originalBeforeAttack = pet.originalBeforeAttack?.bind(pet);
        pet.beforeAttack = (gameApi) => {
            if (originalBeforeAttack != null) {
                originalBeforeAttack(gameApi);
            }
            
            // Check if equipment is still equipped  
            if (pet.equipment !== this) {
                return;
            }
            
            let baseManaGain = 3;
            let manaGain = baseManaGain * this.multiplier;
            
            this.logService.createLog({
                message: `${pet.name} gained ${manaGain} mana. (Rambutan)${this.multiplierMessage}`,
                type: 'equipment',
                player: pet.parent
            })
            pet.increaseMana(manaGain);
            
        }
    }

    constructor(private logService: LogService) {
        super();
    }
}