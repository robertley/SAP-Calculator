import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { WalnutAbility } from "../../abilities/equipment/custom/walnut-ability.class";

export class Walnut extends Equipment {
    name = 'Walnut';
    equipmentClass: EquipmentClass = 'shield';
    power = 3;
    originalPower = 3;
    uses = 1;
    originalUses = 1;
    callback = (pet: Pet) => {
        pet.addAbility(new WalnutAbility(pet, this));
    }
}
