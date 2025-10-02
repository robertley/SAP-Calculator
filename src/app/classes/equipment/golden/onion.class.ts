import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { OnionAbility } from "../../abilities/equipment/golden/onion-ability.class";

export class Onion extends Equipment {
    name = 'Onion';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new OnionAbility(pet, this, this.logService));
    }
    constructor(
        protected logService: LogService
    ) {
        super();
    }

}