import { LogService } from 'app/services/log.service';
import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class GoldenEgg extends Equipment {
  name = 'Golden Egg';
  equipmentClass: EquipmentClass = 'beforeAttack';
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    pet.addAbility(new GoldenEggAbility(pet, equipment));
  };

  constructor(protected logService: LogService) {
    super();
  }
}


export class GoldenEggAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'GoldenEggAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Golden Egg is removed after one use
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    let opponentPets = owner.parent.opponent.petArray;
    let attackPet: Pet = null;
    for (let opponentPet of opponentPets) {
      if (opponentPet.alive) {
        attackPet = opponentPet;
        break;
      }
    }

    if (attackPet == null) {
      return;
    }

    let multiplier = this.equipment.multiplier;

    for (let i = 0; i < multiplier; i++) {
      // Use proper snipePet method which handles all the damage logic correctly
      owner.snipePet(attackPet, 6, false, false, false, true, false);
    }

    // Remove equipment after use
    owner.removePerk();
  }
}
