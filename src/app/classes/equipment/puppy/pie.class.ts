import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Pie extends Equipment {
    name = 'Pie';
    tier = 4;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle = pet.originalBeforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi);
            }
            let multiplier = 1;
            let pantherMessage = '';
            if (pet instanceof Panther) {
                multiplier = pet.level + 1;
                pantherMessage = ' (Panther)';
            }
            pet.increaseAttack(4 * multiplier);
            pet.increaseHealth(4 * multiplier);
            this.logService.createLog({
                message: `${pet.name} gained ${4 * multiplier} attack and ${4 * multiplier} health (Pie)${pantherMessage}`,
                type: 'equipment',
                player: pet.parent
            })
        }
    }
    
    constructor(protected logService: LogService) {
        super();
    }
}