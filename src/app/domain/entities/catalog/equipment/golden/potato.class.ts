import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Potato extends Equipment {
  name = 'Potato';
  equipmentClass = 'shield-snipe' as EquipmentClass;
  power = 10;
  uses = 2;
  originalUses = 2;
  originalPower = 10;
}
