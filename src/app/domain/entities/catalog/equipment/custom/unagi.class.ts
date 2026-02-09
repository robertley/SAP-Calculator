import { Equipment, EquipmentClass } from '../../../equipment.class';
import { Pet } from '../../../pet.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Unagi extends Equipment {
  name = 'Unagi';
  equipmentClass = 'startOfBattle' as EquipmentClass;
  hasRandomEvents = true;
  callback = (pet: Pet) => {
    const equipment = pet.getEquippedEquipmentInstance(this);
    // Add Unagi ability using dedicated ability class
    pet.addAbility(new UnagiAbility(pet, equipment));
  };

  constructor() {
    super();
  }
}


export class UnagiAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'UnagiAbility',
      owner: owner,
      triggers: ['BeforeStartBattle'],
      abilityType: 'Equipment',
      native: true,
      abilitylevel: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.equipment = equipment;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    for (let i = 0; i < this.equipment.multiplier; i++) {
      // Get random enemy target
      let targetResp = owner.parent.opponent.getRandomPet(
        [],
        false,
        true,
        false,
        owner,
      );
      if (targetResp.pet) {
        let damage = 2;
        owner.snipePet(
          targetResp.pet,
          damage,
          targetResp.random,
          false,
          false,
          true,
          false,
        );
      }
    }
  }
}

