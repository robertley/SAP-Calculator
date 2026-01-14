import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { LovePotionAbility } from "../../abilities/equipment/unicorn/love-potion-ability.class";

export class LovePotion extends Equipment {
    name = 'Love Potion';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    tier = 5;
    callback = (pet: Pet) => {
        pet.addAbility(new LovePotionAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}
