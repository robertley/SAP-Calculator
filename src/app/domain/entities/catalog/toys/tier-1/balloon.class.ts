import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';


export class Balloon extends Toy {
  name = 'Balloon';
  tier = 1;
  onBreak(gameApi?: GameAPI, puma?: boolean) {
    let targets = this.parent.getFurthestUpPets(this.level, []);
    if (targets.pets.length == 0) {
      return;
    }
    let power = 1;
    for (let target of targets.pets) {
      target.increaseAttack(power);
      target.increaseHealth(power);
      this.logService.createLog({
        message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}


export class BalloonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BalloonAbility',
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
    const { gameApi, triggerPet, tiger } = context;
    const owner = this.owner;

    // Mirror Balloon toy behavior
    let targetsResp = owner.parent.getFurthestUpPets(this.level, [], owner);
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    let power = 1;
    for (let target of targets) {
      target.increaseAttack(power);
      target.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BalloonAbility {
    return new BalloonAbility(newOwner, this.logService);
  }
}




