import { Equipment, EquipmentClass } from '../../equipment.class';

export class MapleSyrup extends Equipment {
  name = 'Maple Syrup';
  tier = 5;
  equipmentClass = 'shield' as EquipmentClass;
  power = 0;
  originalPower = 0;
  uses = 2;
  originalUses = 2;
}

export class MapleSyrupAttack extends Equipment {
  name = 'Maple Syrup (Attack)';
  equipmentClass = 'attack' as EquipmentClass;
  power = 0;
  originalPower = 0;
}
//TO DO: Might need change
