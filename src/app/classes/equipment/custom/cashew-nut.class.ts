import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { CashewNutAbility } from "../../abilities/equipment/custom/cashew-nut-ability.class";

export class CashewNut extends Equipment {
    name = 'Cashew Nut';
    tier = 1;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        // Add Cashew Nut ability using dedicated ability class
        pet.addAbility(new CashewNutAbility(pet, this));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}