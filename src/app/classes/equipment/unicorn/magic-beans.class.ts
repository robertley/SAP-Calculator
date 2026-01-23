import { Equipment, EquipmentClass } from '../../equipment.class';


export class MagicBeans extends Equipment {
  name = 'Magic Beans';
  equipmentClass = 'shop' as EquipmentClass;
  constructor() {
    super();
  }
}
