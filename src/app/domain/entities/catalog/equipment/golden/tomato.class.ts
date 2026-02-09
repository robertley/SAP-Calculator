import { LogService } from 'app/integrations/log.service';
import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Tomato extends Equipment {
  name = 'Tomato';
  tier = 6;
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new TomatoAbility(pet, equipment));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class TomatoAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'TomatoAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Tomato is removed after one use
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    let multiplier = this.equipment.multiplier;

    for (let i = 0; i < multiplier; i++) {
      let targetResp = owner.parent.opponent.getLastPet();
      if (targetResp.pet == null) {
        break;
      }

      // Use proper snipePet method which handles all the damage logic correctly
      owner.snipePet(
        targetResp.pet,
        10,
        targetResp.random,
        false,
        false,
        true,
        false,
      );
    }

    // Remove equipment after use
    owner.removePerk();
  }
}


