import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';

export class FigAbility extends Ability {
  private equipment: Equipment;

  constructor(owner: Pet, equipment: Equipment) {
    super({
      name: 'FigAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Equipment',
      native: true,
      maxUses: 1, // Fig is removed after one use
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
      let attackPet = owner.parent.opponent.getLowestHealthPet().pet;
      if (attackPet == null) {
        return;
      }

      // Use proper snipePet method with equipment=true flag
      owner.snipePet(attackPet, 4, true, false, false, true, false);
    }

    // Remove equipment after use
    owner.removePerk();
  }
}
