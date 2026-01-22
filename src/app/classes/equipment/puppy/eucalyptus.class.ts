import { Equipment, EquipmentClass } from '../../equipment.class';

export class Eucalyptus extends Equipment {
  name = 'Eucalyptus';
  equipmentClass: EquipmentClass = 'shield';
  power = 4;
  originalPower = 4;
  uses = 1;
  originalUses = 1;
}
