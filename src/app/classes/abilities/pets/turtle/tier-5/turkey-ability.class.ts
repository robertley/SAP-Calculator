import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Power } from 'app/interfaces/power.interface';
import {
  logAbility,
  resolveFriendSummonedTarget,
} from '../../../ability-helpers';

export class TurkeyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TurkeyAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const power: Power = {
      attack: 3 * this.level,
      health: 1 * this.level,
    };

    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    target.increaseAttack(power.attack);
    target.increaseHealth(power.health);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TurkeyAbility {
    return new TurkeyAbility(newOwner, this.logService);
  }
}
