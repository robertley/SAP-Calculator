import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Croissant extends Equipment {
    name = 'Croissant';
    equipmentClass: EquipmentClass = 'shop';
    constructor(
    ) {
        super()
    }
}