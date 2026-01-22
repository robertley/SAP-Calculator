import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SealAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SealAbility',
      owner: owner,
      triggers: ['FoodEatenByThis'],
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

    if (triggerPet != owner) {
      return;
    }
    let power = this.level;
    let targetsResp = owner.parent.getRandomPets(
      3,
      [owner],
      true,
      false,
      owner,
    );
    for (let target of targetsResp.pets) {
      if (target != null) {
        target.increaseAttack(power);
        this.logService.createLog({
          message: `${owner.name} gave ${target.name} ${power} attack.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          randomEvent: targetsResp.random,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SealAbility {
    return new SealAbility(newOwner, this.logService);
  }
}
