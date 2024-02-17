import { Equipment, EquipmentClass } from "../../equipment.class";

export class Exposed extends Equipment {
    name = 'Exposed';
    equipmentClass: EquipmentClass = 'ailment-other';
    uses = 2;
    originalUses = 2;
}