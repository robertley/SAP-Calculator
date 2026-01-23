import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class TennisBall extends Toy {
  name = 'Tennis Ball';
  tier = 2;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let targetResp = this.parent.opponent.getRandomPets(
      this.level,
      [],
      false,
      true,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      this.toyService.snipePet(
        target,
        3,
        this.parent,
        this.name,
        targetResp.random,
        puma,
      );
    }
  }
}


export class TennisBallAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TennisBallAbility',
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

    // Mirror Tennis Ball toy behavior
    let targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      [],
      false,
      true,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      owner.snipePet(target, 3, targetResp.random, tiger);
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TennisBallAbility {
    return new TennisBallAbility(newOwner, this.logService);
  }
}

