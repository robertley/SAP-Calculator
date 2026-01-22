import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';

export class SphinxAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Sphinx Ability',
      owner: owner,
      triggers: ['ThisBought'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const toyLevel = this.level;

    const adventurousToys = [
      'Tennis Ball',
      'Plastic Saw',
      'Toilet Paper',
      'Foam Sword',
      'Flashlight',
      'Television',
    ];

    // Choose one random adventurous toy
    const randomIndex = Math.floor(Math.random() * adventurousToys.length);
    const toyName = adventurousToys[randomIndex];

    const newToy = (gameApi as any).toyService.createToy(
      toyName,
      owner.parent,
      toyLevel,
    );
    if (newToy) {
      owner.parent.toy = newToy;

      (gameApi as any).logService.createLog({
        message: `${owner.name} gained a level ${toyLevel} ${toyName}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SphinxAbility {
    return new SphinxAbility(newOwner);
  }
}
