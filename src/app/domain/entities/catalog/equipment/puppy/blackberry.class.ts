import { Equipment, EquipmentClass } from '../../../equipment.class';


export class Blackberry extends Equipment {
  name = 'Blackberry';
  tier = 3;
  equipmentClass: EquipmentClass = 'shop';
  constructor() {
    super();
  }
  //coded in givePetEquipment
}
