import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { SquashAbility } from '../../abilities/equipment/puppy/squash-ability.class';

export class Squash extends Equipment {
  name = 'Squash';
  tier = 3;
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    // Add Squash ability using dedicated ability class
    pet.addAbility(new SquashAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
