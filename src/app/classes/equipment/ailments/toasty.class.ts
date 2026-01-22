import { Equipment, EquipmentClass } from '../../equipment.class';

export class Toasty extends Equipment {
  name = 'Toasty';
  equipmentClass: EquipmentClass = 'ailment-other';
  uses = 1;
  originalUses = 1;
}
