import { Equipment, EquipmentClass } from '../../equipment.class';

export class Lemon extends Equipment {
  equipmentClass = 'shield' as EquipmentClass;
  name = 'Lemon';
  tier = 5;
  power = 7;
  originalPower = 7;
  uses = 2;
  originalUses = 2;
}
