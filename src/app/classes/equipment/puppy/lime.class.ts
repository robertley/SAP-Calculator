import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';

export class Lime extends Equipment {
  equipmentClass = 'defense' as EquipmentClass;
  name = 'Lime';
  tier = 2;
  power = 1;
  originalPower = 1;
  callback = (_pet: Pet) => {};
}
