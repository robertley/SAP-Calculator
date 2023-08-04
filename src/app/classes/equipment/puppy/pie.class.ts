import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Pie extends Equipment {
    name = 'Pie';
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
}