import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { FigAbility } from '../../abilities/equipment/golden/fig-ability.class';

export class Fig extends Equipment {
  name = 'Fig';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    pet.addAbility(new FigAbility(pet, this));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
