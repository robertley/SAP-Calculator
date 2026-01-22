import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class VampireBatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VampireBatAbility',
      owner: owner,
      triggers: ['EnemyGainedAilment'],
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

    let power = this.level * 4;
    let snipeTargetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let snipeTarget = snipeTargetResp.pet;
    if (snipeTarget == null) {
      return;
    }

    let petHealthPreSnipe = snipeTarget.health;
    let damage = owner.snipePet(snipeTarget, power, false, tiger);
    let healthGained = Math.min(damage, petHealthPreSnipe);

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${healthGained} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });
    target.increaseHealth(healthGained);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VampireBatAbility {
    return new VampireBatAbility(newOwner, this.logService);
  }
}
