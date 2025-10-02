import { Panther } from "app/classes/pets/puppy/tier-5/panther.class";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { ChocolateCakeAbility } from "../../abilities/equipment/golden/chocolate-cake-ability.class";

export class ChocolateCake extends Equipment {
    name = 'Chocolate Cake';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        pet.addAbility(new ChocolateCakeAbility(pet, this, this.logService, this.abilityService));
    }

    constructor(protected logService: LogService, protected abilityService: AbilityService) {
        super();
    }

}