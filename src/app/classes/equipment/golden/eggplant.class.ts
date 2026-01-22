import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { EggplantAbility } from '../../abilities/equipment/golden/eggplant-ability.class';

export class Eggplant extends Equipment {
  name = 'Eggplant';
  equipmentClass = 'beforeStartOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    pet.addAbility(new EggplantAbility(pet, this, this.logService));
  };
  constructor(protected logService: LogService) {
    super();
  }
}
