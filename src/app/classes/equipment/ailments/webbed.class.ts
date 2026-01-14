import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { WebbedAbility } from "../../abilities/equipment/ailments/webbed-ability.class";

export class Webbed extends Equipment {
    name = 'Webbed';
    equipmentClass: EquipmentClass = 'ailment-other';
    callback = (pet: Pet) => {
        pet.addAbility(new WebbedAbility(pet));
    }
}
