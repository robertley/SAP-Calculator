import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { ManaPotionAbility } from '../../abilities/equipment/custom/mana-potion-ability.class';

export class ManaPotion extends Equipment {
  name = 'Mana Potion';
  equipmentClass: EquipmentClass = 'beforeStartOfBattle';
  callback = (pet: Pet) => {
    pet.addAbility(new ManaPotionAbility(pet, this));
  };
}
