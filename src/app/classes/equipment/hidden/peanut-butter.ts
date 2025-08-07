import { Equipment, EquipmentClass } from "../../equipment.class";

export class PeanutButter extends Equipment {
    name = 'Peanut Butter';
    equipmentClass = 'attack' as EquipmentClass;
    power = 0;
    uses = 1;
    originalUses = 1;
}