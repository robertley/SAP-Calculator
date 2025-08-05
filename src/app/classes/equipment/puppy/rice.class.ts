import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Rice extends Equipment {
    name = 'Rice';
    equipmentClass: EquipmentClass = 'shop';
}