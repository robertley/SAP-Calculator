import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Corncob extends Equipment {
  name = 'Corncob';
  tier = 1;
  equipmentClass: EquipmentClass = 'shop';
  effectMultiplier: number = 1;
}
