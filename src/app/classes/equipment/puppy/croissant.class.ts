import { AbilityService } from "../../../services/ability/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Croissant extends Equipment {
    name = 'Croissant';
    tier = 3;
    equipmentClass: EquipmentClass = 'shop';
    constructor(
    ) {
        super()
    }
}