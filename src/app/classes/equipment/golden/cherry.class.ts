import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { CherryAbility } from "../../abilities/equipment/golden/cherry-ability.class";

export class Cherry extends Equipment {
    name = 'Cherry';
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        pet.addAbility(new CherryAbility(pet, this));
    }
}