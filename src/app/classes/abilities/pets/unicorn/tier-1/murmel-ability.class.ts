import { Ability, AbilityContext } from '../../../../ability.class';
import { Power } from 'app/interfaces/power.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class MurmelAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MurmelAbility',
      owner: owner,
      triggers: ['FriendGainedExp'],
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

    let power = this.level;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    target.increaseAttack(power);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MurmelAbility {
    return new MurmelAbility(newOwner, this.logService);
  }
}
