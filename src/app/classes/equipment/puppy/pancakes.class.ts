import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment, EquipmentClass } from "../../equipment.class";

export class Pancakes extends Equipment {
    name = 'Pancakes';
    tier = 6;
    equipmentClass: EquipmentClass = 'beforeStartOfBattle';
}