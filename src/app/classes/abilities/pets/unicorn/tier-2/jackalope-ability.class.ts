import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class JackalopeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'JackalopeAbility',
      owner: owner,
      triggers: ['BeforeFriendAttacks'],
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
    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    let power = this.level;
    if (owner.jumped) {
      power *= 2;
    }
    target.increaseAttack(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${power} attack.`,
      type: 'ability',
      player: this.owner.parent,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): JackalopeAbility {
    return new JackalopeAbility(newOwner, this.logService);
  }
}
