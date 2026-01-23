import { Equipment, EquipmentClass } from '../../equipment.class';


export class MelonSlice extends Equipment {
  name = 'Melon Slice';
  equipmentClass: EquipmentClass = 'shield';
  power = 10;
  originalPower = 10;
  uses = 1;
  originalUses = 1;
}
