import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class TatzelwurmAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TatzelwurmAbility',
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
    let power = this.level * 2;
    if (triggerPet && triggerPet.level == 3) {
      power = power * 2;
    }

    let targetResp = owner.parent.opponent.getFurthestUpPet(owner);
    if (targetResp.pet == null) {
      return;
    }

    owner.snipePet(targetResp.pet, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TatzelwurmAbility {
    return new TatzelwurmAbility(newOwner, this.logService);
  }
}
