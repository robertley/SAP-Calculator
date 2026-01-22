import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class HoopoeBirdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HoopoeBirdAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    let opponent = owner.parent.opponent;

    // Get front target
    let targetFrontResp = opponent.getFurthestUpPet(owner);
    let targetFront = targetFrontResp.pet;

    // Get back target (could be different if Silly)
    let targetBackResp = opponent.getLastPet(undefined, owner);
    let targetBack = targetBackResp.pet;

    let power = 2 * this.level;

    if (targetFront) {
      owner.snipePet(
        targetFront,
        power,
        targetFrontResp.random,
        tiger,
        pteranodon,
      );
    }
    if (targetBack) {
      owner.snipePet(
        targetBack,
        power,
        targetBackResp.random,
        tiger,
        pteranodon,
      );
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HoopoeBirdAbility {
    return new HoopoeBirdAbility(newOwner, this.logService);
  }
}
