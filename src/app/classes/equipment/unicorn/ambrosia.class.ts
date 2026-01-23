import { Equipment, EquipmentClass } from '../../equipment.class';


export class Ambrosia extends Equipment {
  name = 'Ambrosia';
  tier = 4;
  equipmentClass = 'shield' as EquipmentClass;
  power = 8;
  originalPower = 8;
  uses = 1;
  originalUses = 1;
}
