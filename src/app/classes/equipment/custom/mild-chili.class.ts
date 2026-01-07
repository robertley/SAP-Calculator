import { AbilityService } from "../../../services/ability.service";
import { LogService } from "app/services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class MildChili extends Equipment {
    name = 'Mild Chili';
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    originalPower = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let target = attackedPet.parent.getPetAtPosition(1);
        if (target == null) {
            return;
        }
        pet.snipePet(target, 4, false, null, null, true);
    }

    constructor(protected logService: LogService, protected abilityService: AbilityService) {
        super();
    }
}
