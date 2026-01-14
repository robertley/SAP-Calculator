import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { ConfusedAbility } from "../../abilities/equipment/ailments/confused-ability.class";

export class Confused extends Equipment {
    name = 'Confused';
    equipmentClass: EquipmentClass = 'ailment-other';
    callback = (pet: Pet) => {
        pet.addAbility(new ConfusedAbility(pet));
    }
}
