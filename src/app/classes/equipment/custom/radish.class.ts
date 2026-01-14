import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { LogService } from "../../../services/log.service";
import { RadishAbility } from "../../abilities/equipment/custom/radish-ability.class";

export class Radish extends Equipment {
    name = 'Radish';
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
    callback = (pet: Pet) => {
        pet.addAbility(new RadishAbility(pet, this, this.logService));
    };

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}
