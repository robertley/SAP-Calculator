import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Bee } from "../../pets/hidden/bee.class";
import { Monkey } from "../../pets/turtle/tier-5/monkey.class";
import { BananaAbility } from "../../abilities/equipment/golden/banana-ability.class";

export class Banana extends Equipment {
    name = 'Banana';
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new BananaAbility(pet, this, this.logService, this.abilityService));
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService
    ) {
        super()
    }
}