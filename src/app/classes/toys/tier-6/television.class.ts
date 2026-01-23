import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class Television extends Toy {
  name = 'Television';
  tier = 6;
  onBreak(gameApi?: GameAPI, puma?: boolean) {
    let power = this.level * 2;
    for (let pet of this.parent.petArray) {
      if (!pet.alive) {
        continue;
      }
      pet.increaseAttack(power);
      pet.increaseHealth(power);
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} ${power} attack and ${power} health.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}


export class TelevisionAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TelevisionAbility',
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

    // Mirror Television toy behavior (onBreak effect)
    let power = this.level * 2;
    let targetsResp = owner.parent.getAll(false, owner, true);
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      pet.increaseAttack(power);
      pet.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} ${power} attack and ${power} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TelevisionAbility {
    return new TelevisionAbility(newOwner, this.logService);
  }
}

