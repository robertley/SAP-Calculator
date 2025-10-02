import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { CocoaBeanAbility } from "../../abilities/equipment/danger/cocoa-bean-ability.class";

export class CocoaBean extends Equipment {
    name = 'Cocoa Bean';
    tier = 5;
    equipmentClass = 'beforeAttack' as EquipmentClass;
    power = 0;
    originalPower = 0;
    uses = 1;
    originalUses = 1;
    callback = (pet: Pet) => {
        // Add Cocoa Bean ability using dedicated ability class
        pet.addAbility(new CocoaBeanAbility(pet, this, this.logService, this.petService));
    }

    constructor(
        protected logService: LogService,
        protected petService: PetService
    ) {
        super();
    }
}