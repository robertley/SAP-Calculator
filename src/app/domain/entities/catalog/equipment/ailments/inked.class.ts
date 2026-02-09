import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Inked extends Equipment {
  name = 'Inked';
  equipmentClass: EquipmentClass = 'ailment-attack';
  power = -3;
  originalPower = -3;
}
