import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class LadybugAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LadybugAbility',
      owner: owner,
      triggers: ['FriendlyGainsPerk'],
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
    let selfTargetResp = owner.parent.getThis(owner);
    if (selfTargetResp.pet) {
      selfTargetResp.pet.increaseAttack(power);
      this.logService.createLog({
        message: `${owner.name} gave ${selfTargetResp.pet.name} ${power} attack.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: selfTargetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LadybugAbility {
    return new LadybugAbility(newOwner, this.logService);
  }
}
