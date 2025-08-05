import { Equipment, EquipmentClass } from "../../equipment.class";

// TODO - better log language related to power?
export class Coconut extends Equipment {
    name = 'Coconut';
    equipmentClass = 'shield' as EquipmentClass;
    power = 999;
    originalPower = 999;
    uses = 1;
    originalUses = 1;
}