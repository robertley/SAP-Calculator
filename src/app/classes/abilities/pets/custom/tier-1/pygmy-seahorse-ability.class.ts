import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class PygmySeahorseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PygmySeahorseAbility',
      owner: owner,
      triggers: ['StartBattle'],
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const targetsResp = owner.parent.getRandomPets(
      3,
      [owner],
      false,
      false,
      owner,
    );
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      return;
    }

    for (const target of targets) {
      target.increaseAttack(this.level);
      target.increaseHealth(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +${this.level} attack and +${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    owner.health = 0;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PygmySeahorseAbility {
    return new PygmySeahorseAbility(newOwner, this.logService);
  }
}
