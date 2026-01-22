import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class NamazuAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Namazu Ability',
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
    const owner = this.owner;
    const manaSpent = owner.mana;
    if (manaSpent <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const basePerLevel = [3, 6, 9];
    const perManaBonus = [1, 2, 3];
    const levelIndex = Math.min(Math.max(this.level - 1, 0), 2);
    const base = basePerLevel[levelIndex];
    const bonusPerMana = perManaBonus[levelIndex];
    const total = base + manaSpent * bonusPerMana;

    owner.parent.gainTrumpets(total, owner, context.pteranodon);
    owner.mana = 0;

    this.logService.createLog({
      message: `${owner.name} spent ${manaSpent} mana and gained ${total} trumpets.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): NamazuAbility {
    return new NamazuAbility(newOwner, this.logService);
  }
}
