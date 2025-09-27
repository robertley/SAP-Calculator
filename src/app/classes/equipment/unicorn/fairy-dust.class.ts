import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { FairyDustAbility } from "../../abilities/equipment/unicorn/fairy-dust-ability.class";

export class FairyDust extends Equipment {
    name = 'Fairy Dust';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new FairyDustAbility(pet, this, this.logService));
    }
    constructor(
        protected logService: LogService
    ) {
        super();
    }
}