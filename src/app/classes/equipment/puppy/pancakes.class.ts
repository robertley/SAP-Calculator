import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { PancakesAbility } from "../../abilities/equipment/puppy/pancakes-ability.class";

export class Pancakes extends Equipment {
    name = 'Pancakes';
    tier = 6;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        // Add Pancakes ability using dedicated ability class
        pet.addAbility(new PancakesAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}