import { Equipment, EquipmentClass } from "../../equipment.class";

export class Raspberry extends Equipment {
    name = 'Raspberry';
    equipmentClass: EquipmentClass = 'target';
    constructor(
    ) {
        super()
    }
}
