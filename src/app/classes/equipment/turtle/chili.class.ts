import { cloneDeep } from "lodash";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Chili extends Equipment {
    name = 'Chili';
    equipmentClass = 'skewer' as EquipmentClass;
    power = 0;
    originalPower = 0;
    attackCallback = (pet: Pet, attackedPet: Pet) => {
        let attackPet = attackedPet.parent.getPetAtPosition(1);
        if (attackPet == null) {
            return;
        }
        pet.snipePet(attackPet, 5, false, null, null, true);
    }

    constructor(protected logService: LogService, protected abilityService: AbilityService) {
        super()
    }
}