import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { HealthPotionAbility } from "../../abilities/equipment/unicorn/health-potion-ability.class";

export class HealthPotion extends Equipment {
    name = 'Health Potion';
    equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new HealthPotionAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService
    ) {
        super();
    }
}