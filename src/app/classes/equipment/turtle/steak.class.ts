import { Equipment, EquipmentClass } from '../../equipment.class';

export class Steak extends Equipment {
  name = 'Steak';
  equipmentClass = 'attack' as EquipmentClass;
  tier = 6;
  power = 20;
  originalPower = 20;
  uses = 1;
  originalUses = 1;
}
