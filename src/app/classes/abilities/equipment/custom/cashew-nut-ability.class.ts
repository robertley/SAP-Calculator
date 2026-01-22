import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';

export class CashewNutAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'CashewNutAbility',
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
      let targetResp = owner.parent.nearestPetsAhead(2, owner, null, true);
      let targets = targetResp.pets.filter((pet) => pet?.alive);
      if (targets.length < 2) {
        return;
      }
      let target = targets[1];
      if (target.parent == owner.parent) {
        owner.snipePet(target, 1, targetResp.random, null, null, true);
      } else {
        owner.snipePet(target, 2, targetResp.random, null, null, true);
      }
    }
  }
}
