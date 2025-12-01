import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Tandgnost } from "../../pets/custom/tier-4/tandgnost.class";
import { Tandgrisner } from "../../pets/custom/tier-5/tandgrisner.class";
import { YggdrasilFruitAbility } from "../../abilities/equipment/unicorn/yggdrasil-fruit-ability.class";

export class YggdrasilFruit extends Equipment {
    name = 'Yggdrasil Fruit';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet?: Pet) => {
        pet.addAbility(new YggdrasilFruitAbility(pet, this, this.logService, this.abilityService));
    }
    constructor(protected logService: LogService, protected abilityService: AbilityService) {
        super();
    }
}