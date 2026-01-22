import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class DungBeetleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DungBeetleAbility',
      owner: owner,
      triggers: ['FoodEatenByFriendly', 'ThisDied'],
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
    const ownerData = owner as unknown as {
      dungBeetleFoodEaten?: number;
      dungBeetleFoodTurn?: number;
    };

    const turnNumber = gameApi?.turnNumber ?? 0;
    if (ownerData.dungBeetleFoodTurn !== turnNumber) {
      ownerData.dungBeetleFoodTurn = turnNumber;
      ownerData.dungBeetleFoodEaten = 0;
    }

    if (triggerPet && owner.alive) {
      ownerData.dungBeetleFoodEaten = Math.min(
        3,
        (ownerData.dungBeetleFoodEaten ?? 0) + 1,
      );
      return;
    }

    if (owner.alive) {
      return;
    }

    const foodCount = Math.min(3, ownerData.dungBeetleFoodEaten ?? 0);
    if (foodCount <= 0) {
      return;
    }

    const power = this.level * 3;
    for (let i = 0; i < foodCount; i++) {
      let targetResp = owner.parent.opponent.getLowestHealthPet(
        undefined,
        owner,
      );
      let target = targetResp.pet;
      if (target == null) {
        break;
      }
      owner.snipePet(target, power, targetResp.random, tiger);
    }

    this.logService.createLog({
      message: `${owner.name} dealt ${power} damage ${foodCount} time(s) to the weakest enemy.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DungBeetleAbility {
    return new DungBeetleAbility(newOwner, this.logService);
  }
}
