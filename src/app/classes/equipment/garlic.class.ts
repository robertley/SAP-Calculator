import { Equipment, EquipmentClass } from "../equipment.class";

export class Garlic extends Equipment {
    equipmentClass = 'defense' as EquipmentClass;
    name = 'Garlic';
    power = 2;
    callback: () => {

    }
}