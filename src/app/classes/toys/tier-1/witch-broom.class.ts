import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { getOpponent } from 'app/util/helper-functions';
import { Weak } from 'app/classes/equipment/ailments/weak.class';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class WitchBroom extends Toy {
  name = 'Witch Broom';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    let excludePets = opponent.petArray.filter((pet) => pet.equipment != null);
    let targets = [];
    for (let i = 0; i < this.level; i++) {
      let targetResp = opponent.getRandomPet(
        excludePets,
        false,
        true,
        false,
        null,
      );
      if (targetResp.pet == null) {
        break;
      }
      excludePets.push(targetResp.pet);
      targets.push(targetResp.pet);
    }
    if (targets.length === 0) {
      this.logService.createLog({
        message: `Player's Witch Broom found no targets`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: true,
      });
      return;
    }
    for (let target of targets) {
      this.logService.createLog({
        message: `${this.name} gave ${target.name} Weak.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: opponent.petArray.length - excludePets.length > 0,
      });
      target.givePetEquipment(new Weak());
    }
  }
}


export class WitchBroomAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WitchBroomAbility',
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

    // Mirror Witch Broom toy behavior
    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'any',
      owner,
    );
    let targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      excludePets,
      false,
      true,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      target.givePetEquipment(new Weak());
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Weak.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WitchBroomAbility {
    return new WitchBroomAbility(newOwner, this.logService);
  }
}

