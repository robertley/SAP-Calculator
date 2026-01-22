import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { CauliflowerAbility } from '../../abilities/equipment/custom/cauliflower-ability.class';

export class Cauliflower extends Equipment {
  name = 'Cauliflower';
  equipmentClass: EquipmentClass = 'shop';
  callback = (pet: Pet) => {
    pet.addAbility(new CauliflowerAbility(pet, this));
  };
}
