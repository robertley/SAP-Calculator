import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { NachosAbility } from '../../abilities/equipment/custom/nachos-ability.class';

export class Nachos extends Equipment {
  name = 'Nachos';
  tier = 1;
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    // Add Nachos ability using dedicated ability class
    pet.addAbility(new NachosAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
