import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class YellowBoxfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'YellowBoxfishAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const allPets = owner.parent
      .getAll(true, owner)
      .pets.filter((pet) => pet && pet.alive && pet !== owner);
    if (allPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const sorted = [...allPets].sort((a, b) => {
      const aVal = a.attack + a.health;
      const bVal = b.attack + b.health;
      return bVal - aVal;
    });

    const targets = sorted.slice(0, this.level);
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const target of targets) {
      target.attack = 20;
      target.health = 20;
    }

    const names = targets.map((pet) => pet.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} set ${names} to 20/20 at faint.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): YellowBoxfishAbility {
    return new YellowBoxfishAbility(newOwner, this.logService);
  }
}
