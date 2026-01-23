import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Nest } from 'app/classes/pets/hidden/nest.class';


export class Egg extends Equipment {
  name = 'Egg';
  tier = 1;
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    // Add Egg ability using dedicated ability class
    pet.addAbility(new EggAbility(pet, this));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class EggAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'EggAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Egg is removed after one use
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet } = context;
    const owner = this.owner;

    let multiplier = this.equipment.multiplier;
    // Special case: Nest with Egg triggers multiple times based on level
    if (owner instanceof Nest) {
      // Use triggerPet level if triggered by Tiger, otherwise use owner level
      const effectiveLevel =
        triggerPet?.name === 'Tiger' ? triggerPet.level : owner.level;
      multiplier += effectiveLevel - 1;
    }

    for (let i = 0; i < multiplier; i++) {
      let opponentPets = owner.parent.opponent.petArray;
      let attackPet: Pet = null;
      for (let opponentPet of opponentPets) {
        if (opponentPet.alive) {
          attackPet = opponentPet;
          break;
        }
      }

      if (attackPet == null) {
        continue;
      }

      // Use proper snipePet method which handles all the damage logic correctly
      owner.snipePet(attackPet, 2, false, false, false, true, false);
    }

    // Remove equipment after use
    owner.removePerk();
  }
}
