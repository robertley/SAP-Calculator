import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { shuffle } from 'app/util/helper-functions';

export class BrahmaChickenAbility extends Ability {
  private logService: LogService;
  private attackers: Set<Pet> = new Set();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Brahma Chicken Ability',
      owner: owner,
      triggers: ['FriendAttacked', 'ThisDied', 'StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { triggerPet, tiger, pteranodon } = context;

    if (context.trigger === 'StartBattle') {
      this.attackers.clear();
      return;
    }

    if (
      context.trigger === 'FriendAttacked' &&
      triggerPet &&
      triggerPet.parent === owner.parent
    ) {
      this.attackers.add(triggerPet);
      return;
    }

    if (context.trigger === 'ThisDied') {
      const eligible = shuffle(
        Array.from(this.attackers).filter((pet) => pet && pet.alive),
      );
      const buffCount = Math.min(3, eligible.length);
      const buffAmount = this.level;
      const applied = eligible.slice(0, buffCount);

      for (const target of applied) {
        target.increaseAttack(buffAmount);
        target.increaseHealth(buffAmount);
      }

      if (applied.length > 0) {
        this.logService.createLog({
          message: `${owner.name} gave ${applied.map((p) => p.name).join(', ')} +${buffAmount}/+${buffAmount} after fainting.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
        });
      }

      this.triggerTigerExecution(context);
    }
  }

  copy(newOwner: Pet): BrahmaChickenAbility {
    return new BrahmaChickenAbility(newOwner, this.logService);
  }
}
