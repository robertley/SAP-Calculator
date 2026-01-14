import { Equipment, EquipmentClass } from "../../equipment.class";

export class BrusselsSprout extends Equipment {
    name = 'Brussels Sprout';
    equipmentClass: EquipmentClass = 'shield';
    power = 5;
    originalPower = 5;
    uses = 1;
    originalUses = 1;
}
