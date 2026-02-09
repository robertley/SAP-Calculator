import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Blueberry extends Equipment {
  name = 'Blueberry';
  equipmentClass: EquipmentClass = 'target';
  constructor() {
    super();
  }
}
