import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { EggAbility } from "../../abilities/equipment/puppy/egg-ability.class";

export class Egg extends Equipment {
    name = 'Egg';
    tier = 1;
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        // Add Egg ability using dedicated ability class
        pet.addAbility(new EggAbility(pet, this));
    }

    constructor(
        protected logService: LogService,
    ) {
        super()
    }
}