import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { BaguetteAbility } from '../../abilities/equipment/star/baguette-ability.class';

export class Baguette extends Equipment {
  name = 'Baguette';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    // Add Baguette ability using dedicated ability class
    pet.addAbility(new BaguetteAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
