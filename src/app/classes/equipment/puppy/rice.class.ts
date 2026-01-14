import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Rice extends Equipment {
    name = 'Rice';
    tier = 2;
    equipmentClass: EquipmentClass = 'shop';
    callback = (pet: Pet) => {
        const sellIncrease = 2 * this.multiplier;
        pet.increaseSellValue(sellIncrease);
    }
}
