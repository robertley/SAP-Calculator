import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { logAbility } from '../../../ability-helpers';

export class HippocampusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HippocampusAbility',
      owner: owner,
      triggers: ['FriendAheadDied'],
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
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    if (!gameApi) {
      this.triggerTigerExecution(context);
      return;
    }

    const rollAmount =
      owner.parent === gameApi.player
        ? gameApi.playerRollAmount || 0
        : gameApi.opponentRollAmount || 0;
    const manaGain = rollAmount * this.level;
    if (manaGain <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.increaseMana(manaGain);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gained ${manaGain} mana from ${rollAmount} rolls this turn.`,
      tiger,
      pteranodon,
    );

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HippocampusAbility {
    return new HippocampusAbility(newOwner, this.logService);
  }
}
