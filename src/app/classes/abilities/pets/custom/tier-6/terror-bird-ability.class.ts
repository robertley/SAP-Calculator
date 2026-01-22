import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Peanut } from '../../../../equipment/turtle/peanut.class';

export class TerrorBirdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TerrorBirdAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { tiger, pteranodon } = context;

    const strawberryPets = owner.parent.petArray
      .filter(
        (pet) =>
          pet &&
          pet !== owner &&
          pet.alive &&
          pet.equipment?.name === 'Strawberry',
      )
      .sort((a, b) => a.position - b.position)
      .slice(0, this.level);

    if (strawberryPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const pet of strawberryPets) {
      pet.givePetEquipment(new Peanut());
    }

    const names = strawberryPets.map((pet) => pet.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} gave Peanut to ${names} at start of battle.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TerrorBirdAbility {
    return new TerrorBirdAbility(newOwner, this.logService);
  }
}
