import { Equipment, EquipmentClass } from "../../equipment.class";

export class Melon extends Equipment {
    name = 'Melon';
    tier = 6;
    equipmentClass = 'shield' as EquipmentClass;
    power = 20;
    originalPower = 20;
    uses = 1;
    originalUses = 1;
    
}