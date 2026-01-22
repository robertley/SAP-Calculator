import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { TastyAbility } from '../../abilities/equipment/ailments/tasty-ability.class';

export class Tasty extends Equipment {
  name = 'Tasty';
  equipmentClass = 'faint' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Tasty ability using dedicated ability class
    pet.addAbility(new TastyAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
