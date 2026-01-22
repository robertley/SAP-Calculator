import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { PieAbility } from '../../abilities/equipment/puppy/pie-ability.class';

export class Pie extends Equipment {
  name = 'Pie';
  tier = 4;
  equipmentClass: EquipmentClass = 'beforeStartOfBattle';
  callback = (pet: Pet) => {
    // Add Pie ability using dedicated ability class
    pet.addAbility(new PieAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
