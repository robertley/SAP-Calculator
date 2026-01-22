import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';

export class SpottedHandfishAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Spotted Handfish Ability',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const amt = this.level;

    const ailments = [
      'Cold',
      'Crisp',
      'Dazed',
      'Icky',
      'Inked',
      'Spooked',
      'Weak',
      'Silly',
      'Bloated',
      'Confused',
      'Cursed',
      'Sad',
      'Sleepy',
      'Webbed',
    ];

    for (let i = 0; i < amt; i++) {
      const randomIndex = Math.floor(Math.random() * ailments.length);
      const ailmentName = ailments[randomIndex];

      // Add to canned ailments
      owner.parent.cannedAilments.push(ailmentName);

      (gameApi as any).logService.createLog({
        message: `${owner.name} stocked a canned ${ailmentName}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SpottedHandfishAbility {
    return new SpottedHandfishAbility(newOwner);
  }
}
