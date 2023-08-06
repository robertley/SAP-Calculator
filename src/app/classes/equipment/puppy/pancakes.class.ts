import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.servicee";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Pancakes extends Equipment {
    name = 'Pancakes';
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
}