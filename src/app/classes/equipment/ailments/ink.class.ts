import { Equipment, EquipmentClass } from "../../equipment.class";

export class Ink extends Equipment {
    name = 'Ink';
    equipmentClass: EquipmentClass = 'ailment-attack';
    power = -3;
    originalPower = -3;
}