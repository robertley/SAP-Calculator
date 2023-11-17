import { Equipment, EquipmentClass } from "../../equipment.class";

export class FortuneCookie extends Equipment {
    name = 'Fortune Cookie';
    equipmentClass: EquipmentClass = 'attack';
    constructor(
    ) {
        super()
    }
}