import { Equipment, EquipmentClass } from "../../equipment.class";

export class Lime extends Equipment {
    equipmentClass = 'defense' as EquipmentClass;
    name = 'Lime';
    tier = 2;
    power = 1;
    originalPower = 1
    callback: () => {

    };
}