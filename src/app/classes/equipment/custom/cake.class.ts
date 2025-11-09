import { Equipment, EquipmentClass } from "../../equipment.class";

export class Cake extends Equipment {
    name = 'Cake';
    equipmentClass: EquipmentClass = 'shop';
    tier = 3;
}