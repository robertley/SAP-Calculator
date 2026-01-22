import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class HumpheadWrasseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HumpheadWrasseAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    let percentage = 0.3 * this.level; // 30%/60%/90%
    let targetResp = owner.parent.opponent.getHighestAttackPet(
      undefined,
      owner,
    );

    if (!targetResp.pet) {
      return;
    }

    let target = targetResp.pet;
    let reductionAmount = Math.ceil(target.attack * percentage);
    let newAttack = Math.max(1, target.attack - reductionAmount);

    target.attack = newAttack;

    this.logService.createLog({
      message: `${owner.name} reduced ${target.name}'s attack by ${percentage * 100}% to (${target.attack})`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HumpheadWrasseAbility {
    return new HumpheadWrasseAbility(newOwner, this.logService);
  }
}
