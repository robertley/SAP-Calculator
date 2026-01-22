import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';

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
