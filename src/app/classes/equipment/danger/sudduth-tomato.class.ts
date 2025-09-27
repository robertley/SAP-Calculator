import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { SudduthTomatoAbility } from "../../abilities/equipment/danger/sudduth-tomato-ability.class";

export class SudduthTomato extends Equipment {
    name = 'Sudduth Tomato';
    equipmentClass = 'hurt' as EquipmentClass;
    callback = (pet: Pet) => {
        // Add Sudduth Tomato ability using dedicated ability class
        pet.addAbility(new SudduthTomatoAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}