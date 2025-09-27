import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { GingerbreadManAbility } from "../../abilities/equipment/unicorn/gingerbread-man-ability.class";

export class GingerbreadMan extends Equipment {
    name = 'Gingerbread Man';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new GingerbreadManAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}