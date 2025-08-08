import { Equipment, EquipmentClass } from "../../equipment.class";

export class HoneydewMelon extends Equipment {
    name = 'Honeydew Melon';
    tier = 5;
    equipmentClass = 'shield' as EquipmentClass;
    power = 10;
    originalPower = 10;
    //one use for attack, one use for defense
    uses = 2;
    originalUses = 2;
}

export class HoneydewMelonAttack extends Equipment {
    name = 'Honeydew Melon (Attack)';
    equipmentClass = 'attack' as EquipmentClass;
    power = 5;
    originalPower = 5;
}