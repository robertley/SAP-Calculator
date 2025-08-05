import { Equipment, EquipmentClass } from "../../equipment.class";

export class Pepper extends Equipment {
    name = 'Pepper';
    equipmentClass: EquipmentClass = 'shield';
    uses = 1;
    originalUses = 1;
    power = 0;
    originalPower = 0;
}