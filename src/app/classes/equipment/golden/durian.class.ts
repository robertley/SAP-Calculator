import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { DurianAbility } from '../../abilities/equipment/golden/durian-ability.class';

export class Durian extends Equipment {
  name = 'Durian';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    pet.addAbility(new DurianAbility(pet, this, this.logService));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
