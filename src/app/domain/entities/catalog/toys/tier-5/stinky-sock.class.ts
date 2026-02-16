import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { getOpponent } from 'app/runtime/player-opponent';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';


export class StinkySock extends Toy {
  name = 'Stinky Sock';
  tier = 5;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    for (let i = 0; i < this.level; i++) {
      let highestHealthPetResp = opponent.getHighestHealthPet();
      let target = highestHealthPetResp.pet;
      if (target == null) {
        return;
      }
      let power = 0.4;
      let reducedTo = Math.max(1, Math.floor(target.health * (1 - power)));
      target.health = reducedTo;
      this.logService.createLog({
        message: `${this.name} reduced ${target.name} health by ${power * 100}% to ${reducedTo}`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: highestHealthPetResp.random,
      });
    }
  }
}


export class StinkySockAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'StinkySockAbility',
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

    // Mirror Stinky Sock toy behavior
    let opponent = owner.parent.opponent;
    let highestHealthPetResp = opponent.getHighestHealthPets(
      this.level,
      [],
      owner,
    );
    let targets = highestHealthPetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      let power = 0.4;
      let reducedTo = Math.max(1, Math.floor(target.health * (1 - power)));
      target.health = reducedTo;
      this.logService.createLog({
        message: `${owner.name} reduced ${target.name} health by ${power * 100}% to ${reducedTo}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: highestHealthPetResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): StinkySockAbility {
    return new StinkySockAbility(newOwner, this.logService);
  }
}







