import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { RambutanAbility } from "../../abilities/equipment/unicorn/rambutan-ability.class";

export class Rambutan extends Equipment {
    name = 'Rambutan';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet) => {
        pet.addAbility(new RambutanAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}