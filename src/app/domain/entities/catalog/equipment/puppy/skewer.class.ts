import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';


export class Skewer extends Equipment {
  name = 'Skewer';
  tier = 5;
  equipmentClass = 'skewer' as EquipmentClass;
  power = 0;
  attackCallback = (pet: Pet, attackedPet: Pet) => {
    this.skewer(pet, attackedPet, 1);
    this.skewer(pet, attackedPet, 2);
  };

  constructor(protected logService: LogService) {
    super();
  }

  skewer(pet: Pet, attackedPet: Pet, position: number) {
    let attackPet = attackedPet.parent.getPetAtPosition(position);
    if (attackPet == null) {
      return;
    }

    const baseDamage = 3;
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
  }
}

