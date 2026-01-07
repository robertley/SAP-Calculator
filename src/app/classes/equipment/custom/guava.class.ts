import { Equipment, EquipmentClass } from "../../equipment.class";

export class Guava extends Equipment {
    name = 'Guava';
    tier = 3;
    equipmentClass = 'shield' as EquipmentClass;
    power = 3;
    originalPower = 3;
    uses = 1;
    originalUses = 1;
}

export class GuavaAttack extends Equipment {
    name = 'Guava (Attack)';
    equipmentClass = 'attack' as EquipmentClass;
    power = 3;
    originalPower = 3;
}