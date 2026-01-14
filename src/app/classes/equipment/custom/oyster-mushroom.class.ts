import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { OysterMushroomAbility } from "../../abilities/equipment/custom/oyster-mushroom-ability.class";

export class OysterMushroom extends Equipment {
    name = 'Oyster Mushroom';
    equipmentClass: EquipmentClass = 'beforeAttack';
    callback = (pet: Pet) => {
        pet.addAbility(new OysterMushroomAbility(pet, this));
    }
}
