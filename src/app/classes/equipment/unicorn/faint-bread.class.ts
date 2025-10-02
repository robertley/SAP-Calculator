import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { FaintBreadAbility } from "../../abilities/equipment/unicorn/faint-bread-ability.class";

//TO DO: Add all tier 1 faint pet
export class FaintBread extends Equipment {
    name = 'Faint Bread';
    equipmentClass: EquipmentClass = 'afterFaint';
    callback = (pet: Pet) => {
        pet.addAbility(new FaintBreadAbility(pet, this, this.petService, this.logService));
    }

    constructor(
        protected logService: LogService,
        protected petService: PetService,

    ) {
        super()
    }

}