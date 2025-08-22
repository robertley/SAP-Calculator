import { Equipment, EquipmentClass } from "../../equipment.class";

export class Peanut extends Equipment {
    name = 'Peanut';
    tier = 7;
    equipmentClass = 'attack' as EquipmentClass;
    power = 0;
}