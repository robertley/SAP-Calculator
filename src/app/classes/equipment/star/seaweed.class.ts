import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { SeaweedAbility } from "../../abilities/equipment/star/seaweed-ability.class";

export class Seaweed extends Equipment {
    name = 'Seaweed';
    equipmentClass = 'beforeAttack' as EquipmentClass;
    callback = (pet: Pet) => {
        // Add Seaweed ability using dedicated ability class
        pet.addAbility(new SeaweedAbility(pet, this, this.logService, this.petService));
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super();
    }
}