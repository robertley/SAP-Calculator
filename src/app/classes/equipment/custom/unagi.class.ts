import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { UnagiAbility } from '../../abilities/equipment/custom/unagi-ability.class';

export class Unagi extends Equipment {
  name = 'Unagi';
  equipmentClass = 'startOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Unagi ability using dedicated ability class
    pet.addAbility(new UnagiAbility(pet, this));
  };

  constructor() {
    super();
  }
}
