import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';

export class Salt extends Equipment {
  name = 'Salt';
  tier = 4;
  equipmentClass: EquipmentClass = 'attack';
  uses = 1;
  originalUses = 1;
}
//Attack for double damage, once.
