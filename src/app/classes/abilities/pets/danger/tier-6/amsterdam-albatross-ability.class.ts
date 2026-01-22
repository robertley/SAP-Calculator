import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class AmsterdamAlbatrossAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AmsterdamAlbatrossAbility',
      owner: owner,
      triggers: ['FriendTransformed'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let attackGain = 2 * owner.level;
    let healthGain = 2 * owner.level;
    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.increaseAttack(attackGain);
    target.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${attackGain} attack and +${healthGain} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmsterdamAlbatrossAbility {
    return new AmsterdamAlbatrossAbility(newOwner, this.logService);
  }
}
