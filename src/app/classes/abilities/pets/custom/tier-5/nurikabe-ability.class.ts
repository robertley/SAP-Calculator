import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';

export class NurikabeAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'NurikabeAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context: AbilityContext) =>
        this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    // Damage reduction handled in player combat; no direct execution needed
  }

  copy(newOwner: Pet): NurikabeAbility {
    return new NurikabeAbility(newOwner);
  }
}
