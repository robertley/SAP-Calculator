import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class AxolotlAbility extends Ability {
  private logService: LogService;
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AxolotlAbility',
      owner: owner,
      triggers: ['FriendlyGainsPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
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
    target.increaseAttack(power);
    target.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AxolotlAbility {
    return new AxolotlAbility(newOwner, this.logService);
  }
}
