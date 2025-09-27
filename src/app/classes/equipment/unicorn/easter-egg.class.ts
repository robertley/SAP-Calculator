import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Monty } from "../../pets/hidden/monty.class";
import { EasterEggAbility } from "../../abilities/equipment/unicorn/easter-egg-ability.class";

export class EasterEgg extends Equipment {
    name = 'Easter Egg';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new EasterEggAbility(pet, this, this.logService, this.abilityService));
    }
    

    constructor(protected logService: LogService, protected abilityService: AbilityService) {
        super();
    }
}