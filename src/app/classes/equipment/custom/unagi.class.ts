import { Equipment, EquipmentClass } from '../../equipment.class';
import { Pet } from '../../pet.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Unagi extends Equipment {
  name = 'Unagi';
  equipmentClass = 'startOfBattle' as EquipmentClass;
  callback = (pet: Pet) => {
    // Add Unagi ability using dedicated ability class
    pet.addAbility(new UnagiAbility(pet, this));
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
        owner.snipePet(targetResp.pet, damage, true, false, false, true, false);
      }
    }
  }
}
