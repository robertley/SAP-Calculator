import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { CursedAbility } from '../../abilities/equipment/ailments/cursed-ability.class';

export class Cursed extends Equipment {
  name = 'Cursed';
  equipmentClass: EquipmentClass = 'ailment-other';
  callback = (pet: Pet) => {
    pet.addAbility(new CursedAbility(pet));
  };
}
