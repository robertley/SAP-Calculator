import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Cherry extends Equipment {
    name = 'Cherry';
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        let originalBeforeStartOfBattle = pet.originalBeforeStartOfBattle?.bind(pet);
        pet.beforeStartOfBattle = (gameApi) => {
            if (originalBeforeStartOfBattle != null) {
                originalBeforeStartOfBattle(gameApi);
            }
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = pet.level + 1;
            }
            pet.parent.gainTrumpets(2 * multiplier, pet, false, multiplier, true);
        }
    }
}