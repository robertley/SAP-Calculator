import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { PitaBreadAbility } from '../../abilities/equipment/golden/pita-bread-ability.class';

export class PitaBread extends Equipment {
  name = 'Pita Bread';
  tier = 6;
  power = 0;
  equipmentClass = 'hurt' as EquipmentClass;
  callback = (pet: Pet) => {
    pet.addAbility(new PitaBreadAbility(pet, this, this.logService));
  };
  constructor(protected logService: LogService) {
    super();
  }
}
