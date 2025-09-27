import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { PetService } from "../../../services/pet.service";
import { MushroomAbility } from "../../abilities/equipment/turtle/mushroom-ability.class";

// TODO mushroom bug spawning as level 1 even when level 3?
export class Mushroom extends Equipment {
    name = 'Mushroom';
    tier = 6;
    equipmentClass = 'afterFaint' as EquipmentClass;
    callback = (pet: Pet) => {
        // Add Mushroom ability using dedicated ability class
        pet.addAbility(new MushroomAbility(pet, this, this.logService, this.petService));
    }

    constructor(
        protected logService: LogService,
        protected petService: PetService
    ) {
        super()
    }
}

