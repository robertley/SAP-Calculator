import { Equipment, EquipmentClass } from '../../equipment.class';


export class Weak extends Equipment {
  name = 'Weak';
  equipmentClass: EquipmentClass = 'ailment-defense';
  power = -3;
  originalPower = -3;
}
