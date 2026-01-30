import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class Radio extends Toy {
  name = 'Radio';
  tier = 2;
  onBreak(gameApi?: GameAPI, puma?: boolean) {
    let pets = this.parent.petArray;
    for (let pet of pets) {
      if (!pet.alive) {
        continue;
      }
      pet.increaseHealth(this.level);
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} ${this.level} health.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}


export class RadioAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RadioAbility',
      owner: owner,
      triggers: ['Faint'],
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

    // Mirror Radio toy behavior (onBreak effect)
    let targetsResp = owner.parent.getAll(false, owner, true);
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      pet.increaseHealth(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} ${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RadioAbility {
    return new RadioAbility(newOwner, this.logService);
  }
}


