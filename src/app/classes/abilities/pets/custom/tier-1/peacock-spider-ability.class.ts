import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Spooked } from 'app/classes/equipment/ailments/spooked.class';
import {
  canApplyAilment,
  getAdjacentAlivePets,
  logAbility,
} from '../../../ability-helpers';

export class PeacockSpiderAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PeacockSpiderAbility',
      owner: owner,
      triggers: ['ThisDied'],
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
    const targets = getAdjacentAlivePets(owner);

    if (targets.length === 0) {
      return;
    }

    for (const target of targets) {
      if (!canApplyAilment(target, 'Spooked')) {
        continue;
      }
      const spooked = new Spooked();
      spooked.power = -this.level;
      spooked.originalPower = spooked.power;
      target.givePetEquipment(spooked);
      logAbility(
        this.logService,
        owner,
        `${owner.name} gave ${target.name} Spooked.`,
        tiger,
        pteranodon,
      );
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PeacockSpiderAbility {
    return new PeacockSpiderAbility(newOwner, this.logService);
  }
}
