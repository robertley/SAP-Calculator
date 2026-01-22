import { Ability, AbilityContext } from '../../../../ability.class';
import { AbilityQueueService } from 'app/services/ability/ability-queue.service';
import { InjectorService } from 'app/services/injector.service';
import { LogService } from 'app/services/log.service';
import { Pet } from '../../../../pet.class';

export class PinkRobinAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Pink Robin Ability',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const maxTier = this.level * 2;
    const friends = owner.parent.petArray.filter(
      (p) => p.alive && p !== owner && p.tier <= maxTier,
    );

    if (friends.length > 0) {
      const randomIndex = Math.floor(Math.random() * friends.length);
      const target = friends[randomIndex];
      const abilityQueueService = InjectorService.getInjector().get(
        AbilityQueueService,
      );
      const logService = InjectorService.getInjector().get(LogService);

      // Activate End Turn on the target
      abilityQueueService.triggerAbility(target, 'EndTurn', owner);

      logService.createLog({
        message: `${owner.name} activated End Turn on ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): PinkRobinAbility {
    return new PinkRobinAbility(newOwner);
  }
}
