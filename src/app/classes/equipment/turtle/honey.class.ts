import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { HoneyAbility } from '../../abilities/equipment/turtle/honey-ability.class';

// apparently when a pet is kiled from snipes honey spawns are less predictable
// this ensures that honey spawns are in the front, for now
export class Honey extends Equipment {
  name = 'Honey';
  equipmentClass = 'afterFaint' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Honey ability using dedicated ability class
    pet.addAbility(
      new HoneyAbility(pet, this, this.logService, this.abilityService),
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}
