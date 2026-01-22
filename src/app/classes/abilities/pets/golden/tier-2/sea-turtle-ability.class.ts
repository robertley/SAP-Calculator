import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import {
  logAbility,
  resolveFriendSummonedTarget,
} from '../../../ability-helpers';

export class SeaTurtleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SeaTurtleAbility',
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

    const power = this.level * 2;
    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    target.increaseHealth(power);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} ${power} health.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SeaTurtleAbility {
    return new SeaTurtleAbility(newOwner, this.logService);
  }
}
