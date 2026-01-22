import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class TsuchinokoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TsuchinokoAbility',
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

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    owner.parent.pushPetToFront(target, true);
    this.logService.createLog({
      message: `${owner.name} pushed ${target.name} to the front and gained ${this.level} experience.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    let expTargetResp = owner.parent.getThis(owner);
    let expTarget = expTargetResp.pet;
    if (expTarget == null) {
      return;
    }
    expTarget.increaseExp(this.level);
    this.logService.createLog({
      message: `${owner.name} gave ${expTarget.name} +${this.level} experience.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TsuchinokoAbility {
    return new TsuchinokoAbility(newOwner, this.logService);
  }
}
