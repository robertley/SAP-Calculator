import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Icky extends Equipment {
  name = 'Icky';
  equipmentClass: EquipmentClass = 'ailment-other';
  uses = 2;
  originalUses = 2;
}
