import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';

export class RoadrunnerAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Roadrunner Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const amt = this.level;

    // Get pets ahead
    const friendsAhead = owner.parent.petArray
      .filter((p) => p.alive && p.position < owner.position)
      .sort((a, b) => b.position - a.position); // Nearest first

    const targets = friendsAhead.slice(0, amt);

    for (const target of targets) {
      // Give Strawberry perk
      const strawberry = (gameApi as any).equipmentService.createEquipment(
        'Strawberry',
        target,
      );
      if (strawberry) {
        target.applyEquipment(strawberry);
      }

      // Give +2 attack
      target.attack += 2;

      (gameApi as any).logService.createLog({
        message: `${owner.name} gave Strawberry and +2 attack to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): RoadrunnerAbility {
    return new RoadrunnerAbility(newOwner);
  }
}
