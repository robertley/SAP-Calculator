import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { getOpponent } from 'app/util/helper-functions';
import { Weak } from 'app/classes/equipment/ailments/weak.class';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class ToiletPaper extends Toy {
  name = 'Toilet Paper';
  tier = 4;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    let weakTargets = opponent.petArray
      .filter((pet) => pet.equipment?.name != 'Weak')
      .slice(0, this.level);
    for (let pet of weakTargets) {
      pet.givePetEquipment(new Weak());
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} Weak.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}


export class ToiletPaperAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ToiletPaperAbility',
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

    // Mirror Toilet Paper toy behavior
    let opponent = owner.parent.opponent;
    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Weak',
      owner,
    );
    let targetResp = opponent.getFurthestUpPets(this.level, excludePets, owner);
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      pet.givePetEquipment(new Weak());
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Weak.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ToiletPaperAbility {
    return new ToiletPaperAbility(newOwner, this.logService);
  }
}

