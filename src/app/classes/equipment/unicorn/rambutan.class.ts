import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

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
            if (pet.equipment?.name != 'Rambutan') {
                return;
            }
            
            let manaGain = 3;
            let pantherMessage = '';
            if (pet instanceof Panther) {
                manaGain = 3 * (pet.level + 1);
                pantherMessage = ' (Panther)';
            }
            
            this.logService.createLog({
                message: `${pet.name} gained ${manaGain} mana. (Rambutan)${pantherMessage}`,
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