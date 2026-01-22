import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Alpaca } from '../../../../pets/star/tier-6/alpaca.class';
import { awardExperienceWithLog } from '../../../ability-effects';
import { resolveFriendSummonedTarget } from '../../../ability-helpers';

export class AlpacaAbility extends Ability {
  private logService: LogService;
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AlpacaAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return triggerPet && !(triggerPet instanceof Alpaca);
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    awardExperienceWithLog({
      logService: this.logService,
      owner,
      context,
      target: targetResp.pet,
      amount: 3,
      extras: { randomEvent: targetResp.random },
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AlpacaAbility {
    return new AlpacaAbility(newOwner, this.logService);
  }
}
