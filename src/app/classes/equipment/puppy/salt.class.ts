import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Salt extends Equipment {
    name = 'Salt';
    equipmentClass: EquipmentClass = 'attack';
    constructor(
    ) {
        super()
    }
}