import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { TomatoAbility } from "../../abilities/equipment/golden/tomato-ability.class";

export class Tomato extends Equipment {
    name = 'Tomato';
    tier = 6;
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        pet.addAbility(new TomatoAbility(pet, this));
    }

    constructor(
        protected logService: LogService,
    ) {
        super()
    }
}