import { Equipment, EquipmentClass } from '../../equipment.class';


export class Cheese extends Equipment {
  name = 'Cheese';
  equipmentClass: EquipmentClass = 'attack';
  uses = 1;
  originalUses = 1;
}
