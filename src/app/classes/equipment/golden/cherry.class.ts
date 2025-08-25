import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Cherry extends Equipment {
    name = 'Cherry';
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle =pet.beforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi, tiger) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi, tiger);
            }
            
            if (tiger) {
                return;
            }
            
            pet.parent.gainTrumpets(2 * this.multiplier, pet, false, this.multiplier, true);
        }
    }
}