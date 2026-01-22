import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class TriceratopsAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TriceratopsAbility',
      owner: owner,
      triggers: ['ThisHurt'],
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

    let targetResp = owner.parent.getRandomPet(
      [owner],
      true,
      false,
      true,
      owner,
    );
    let power = this.level * 3;
    if (targetResp.pet == null) {
      return;
    }
    targetResp.pet.increaseAttack(power);
    targetResp.pet.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gave ${targetResp.pet.name} ${power} attack and ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TriceratopsAbility {
    return new TriceratopsAbility(newOwner, this.logService);
  }
}
