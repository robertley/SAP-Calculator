import { Equipment, EquipmentClass } from "../../equipment.class";

export class Lemon extends Equipment {
    equipmentClass = 'defense' as EquipmentClass;
    name = 'Lemon';
    power = 7;
    uses = 2;
    originalUses = 2;
}