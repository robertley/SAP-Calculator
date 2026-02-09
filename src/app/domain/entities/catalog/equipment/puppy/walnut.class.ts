import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Walnut extends Equipment {
  name = 'Walnut';
  tier = 1; // Assuming Tier 1 equivalent power
  equipmentClass = 'shield' as EquipmentClass;
  power = 2;
  originalPower = 2;
  uses = 1;
  originalUses = 1;
}
