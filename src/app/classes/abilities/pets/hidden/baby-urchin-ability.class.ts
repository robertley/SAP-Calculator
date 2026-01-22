import { Ability, AbilityContext } from '../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';

export class BabyUrchinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BabyUrchinAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    let firstTargetResp = owner.parent.opponent.getFurthestUpPet(owner);
    let targets = [firstTargetResp.pet];
    let isRandom = firstTargetResp.random;
    if (!targets[0]) {
      return;
    }

    for (let i = 0; i < owner.level - 1; i++) {
      let target: Pet;
      if (isRandom) {
        // If Silly, get new random target for each additional hit
        let nextTargetResp = owner.parent.opponent.getFurthestUpPet(owner);
        target = nextTargetResp.pet;
        // Keep using isRandom = true for all targets when Silly
      } else {
        // Normal behavior - target behind current target
        let currTarget = targets[i];
        target = currTarget.petBehind();
      }

      if (!target) {
        break;
      }
      targets.push(target);
    }

    for (let target of targets) {
      if (target) {
        target.increaseHealth(-4);
        this.logService.createLog({
          message: `${owner.name} removed 4 health from ${target.name}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: isRandom,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BabyUrchinAbility {
    return new BabyUrchinAbility(newOwner, this.logService);
  }
}
