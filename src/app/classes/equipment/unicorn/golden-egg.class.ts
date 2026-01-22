import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { GoldenEggAbility } from '../../abilities/equipment/unicorn/golden-egg-ability.class';

export class GoldenEgg extends Equipment {
  name = 'Golden Egg';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    pet.addAbility(new GoldenEggAbility(pet, this));
  };

  constructor(protected logService: LogService) {
    super();
  }
}
