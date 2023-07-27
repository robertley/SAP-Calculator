import { Equipment, EquipmentClass } from "../equipment.class";

export class Steak extends Equipment {
    name = 'Steak';
    equipmentClass = 'attack' as EquipmentClass;
    power = 20;
    uses = 1;
    originalUses = 1;
    
}