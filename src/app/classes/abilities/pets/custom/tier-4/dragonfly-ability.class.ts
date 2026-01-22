import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class DragonflyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DragonflyAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const statGain = this.level;
    const eligible = owner.parent.petArray.filter(
      (pet) => pet && pet.alive && pet !== owner,
    );
    const uniqueLevels = new Map<number, Pet>();

    for (const friend of eligible) {
      if (!uniqueLevels.has(friend.level)) {
        uniqueLevels.set(friend.level, friend);
      }
    }

    if (uniqueLevels.size === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const friend of uniqueLevels.values()) {
      friend.increaseAttack(statGain);
      friend.increaseHealth(statGain);
    }

    this.logService.createLog({
      message: `${owner.name} gave friends +${statGain}/+${statGain} based on unique levels.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DragonflyAbility {
    return new DragonflyAbility(newOwner, this.logService);
  }
}
