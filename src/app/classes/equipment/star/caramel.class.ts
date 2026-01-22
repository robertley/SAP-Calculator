import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { CaramelAbility } from '../../abilities/equipment/star/caramel-ability.class';

export class Caramel extends Equipment {
  name = 'Caramel';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    // Add Caramel ability using dedicated ability class
    pet.addAbility(new CaramelAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
