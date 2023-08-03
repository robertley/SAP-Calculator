import { Equipment, EquipmentClass } from "../../equipment.class";

export class Melon extends Equipment {
    name = 'Melon';
    equipmentClass = 'shield' as EquipmentClass;
    power = 20;
    uses = 1;
    originalUses = 1;
    
}