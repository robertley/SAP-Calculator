import { Equipment, EquipmentClass } from '../../equipment.class';

export class Coconut extends Equipment {
  name = 'Coconut';
  tier = 7;
  equipmentClass = 'shield' as EquipmentClass;
  power = 999;
  originalPower = 999;
  uses = 1;
  originalUses = 1;
}
