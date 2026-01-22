import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';

export class RedCapeAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'RedCapeAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Red Cape toy behavior (friendJumped method)
    // Note: This would need to be triggered when a pet jumps
    // For now, we'll implement the effect as a general ability
    let targets = owner.parent.petArray.filter((p) => p.alive);
    for (let target of targets) {
      this.logService.createLog({
        message: `Red Cape Ability gave ${target.name} ${this.level} attack and ${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
      target.increaseAttack(+this.level);
      target.increaseHealth(+this.level);
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RedCapeAbility {
    return new RedCapeAbility(newOwner, this.logService, this.abilityService);
  }
}
