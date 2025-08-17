import { Equipment, EquipmentClass } from "../../equipment.class";

export class WhiteOkra extends Equipment {
    name = 'White Okra';
    tier = 5;
    equipmentClass = 'shield' as EquipmentClass;
    power = 10; 
    originalPower = 10;
    uses = 2; 
    originalUses = 2;
}