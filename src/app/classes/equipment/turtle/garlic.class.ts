import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Garlic extends Equipment {
    equipmentClass = 'defense' as EquipmentClass;
    name = 'Garlic';
    tier = 3;
    power = 2;
    originalPower = 2;
    minimumDamage = 2;
    callback = (_pet: Pet) => {
    }
}