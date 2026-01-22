import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { CodRoeAbility } from '../../abilities/equipment/danger/cod-roe-ability.class';

export class CodRoe extends Equipment {
  name = 'Cod Roe';
  equipmentClass = 'afterFaint' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Cod Roe ability using dedicated ability class
    pet.addAbility(
      new CodRoeAbility(pet, this, this.logService, this.abilityService),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}
