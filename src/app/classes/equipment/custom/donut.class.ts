import { Equipment, EquipmentClass } from '../../equipment.class';


export class Donut extends Equipment {
  name = 'Donut';
  equipmentClass: EquipmentClass = 'target';
  constructor() {
    super();
  }
}
