import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Cherry extends Equipment {
    name = 'Cherry';
    equipmentClass = 'startOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        let originalStartOfBattle = pet.originalStartOfBattle?.bind(pet);
        pet.startOfBattle = (gameApi) => {
            if (originalStartOfBattle != null) {
                originalStartOfBattle(gameApi);
            }
            let multiplier = 1;
            if (pet instanceof Panther) {
                multiplier = 1 + pet.level;
            }
            pet.parent.gainTrumpets(2 * multiplier, pet, false, multiplier, true);
        }
    }

}