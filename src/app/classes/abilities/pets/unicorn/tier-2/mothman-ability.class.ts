import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class MothmanAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MothmanAbility',
      owner: owner,
      triggers: ['AnyoneGainedAilment'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 5,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const power = this.level;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${power} attack and +${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    target.increaseAttack(power);
    target.increaseHealth(power);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MothmanAbility {
    return new MothmanAbility(newOwner, this.logService);
  }
}
