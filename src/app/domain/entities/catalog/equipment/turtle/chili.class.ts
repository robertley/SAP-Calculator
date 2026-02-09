import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';


export class Chili extends Equipment {
  name = 'Chili';
  equipmentClass = 'skewer' as EquipmentClass;
  power = 0;
  originalPower = 0;
  attackCallback = (pet: Pet, attackedPet: Pet) => {
    let attackPet = attackedPet.parent.getPetAtPosition(1);
    if (attackPet == null) {
      return;
    }
    const baseDamage = 5;
    const multiplier = pet.equipment?.multiplier ?? 1;
    const damage = baseDamage * multiplier;
    pet.snipePet(
      attackPet,
      damage,
      false,
      null,
      null,
      true,
      false,
      'attacked',
      baseDamage,
    );
  };

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
  ) {
    super();
  }
}

