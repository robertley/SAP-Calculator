import { Equipment, EquipmentClass } from "../../equipment.class";

export class Cold extends Equipment {
    name = 'Cold';
    equipmentClass: EquipmentClass = 'ailment-defense';
    power = -5;
}