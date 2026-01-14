import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { CakeAbility } from "../../abilities/equipment/turtle/cake-ability.class";

export class Cake extends Equipment {
    name = 'Cake';
    equipmentClass: EquipmentClass = 'shop';
    tier = 3;
    callback = (pet: Pet) => {
        pet.addAbility(new CakeAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}
