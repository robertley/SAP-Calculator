import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { StrawberryAbility } from "../../abilities/equipment/star/strawberry-ability.class";

export class Strawberry extends Equipment {
    name = 'Strawberry';
    equipmentClass = 'defense' as EquipmentClass;
    tier = 1;
    uses = 2;
    originalUses = 2;

    callback = (pet: Pet) => {
        // Add Strawberry ability using dedicated ability class
        pet.addAbility(new StrawberryAbility(pet, this, this.logService));
    }

    constructor(
        protected logService: LogService,
    ) {
        super();
    }
}