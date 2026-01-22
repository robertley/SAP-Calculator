import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class PoisonDartFrogAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PoisonDartFrogAbility',
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let highestHealthResp = owner.parent.opponent.getHighestHealthPet(
      undefined,
      owner,
    );
    let target = highestHealthResp.pet;
    if (target == null) {
      return;
    }

    owner.snipePet(target, 4 * owner.level, highestHealthResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PoisonDartFrogAbility {
    return new PoisonDartFrogAbility(newOwner, this.logService);
  }
}
