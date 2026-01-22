import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import {
  logAbility,
  resolveFriendSummonedTarget,
} from '../../../ability-helpers';

export class LobsterAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'LobsterAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targetResp = resolveFriendSummonedTarget(owner, context.triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const attackGain = this.level;
    const healthGain = this.level * 2;
    targetResp.pet.increaseAttack(attackGain);
    targetResp.pet.increaseHealth(healthGain);

    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${targetResp.pet.name} ${attackGain} attack and ${healthGain} health.`,
      context.tiger,
      context.pteranodon,
      { randomEvent: targetResp.random },
    );
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LobsterAbility {
    return new LobsterAbility(newOwner, this.logService, this.abilityService);
  }
}
