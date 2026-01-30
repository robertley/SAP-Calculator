import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';


export class MildChili extends Equipment {
  name = 'Mild Chili';
  equipmentClass = 'skewer' as EquipmentClass;
  power = 0;
  originalPower = 0;
  attackCallback = (pet: Pet, attackedPet: Pet) => {
    let attackPet = attackedPet.parent.getPetAtPosition(1);
    if (attackPet == null) {
      return;
    }
    const baseDamage = 4;
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
