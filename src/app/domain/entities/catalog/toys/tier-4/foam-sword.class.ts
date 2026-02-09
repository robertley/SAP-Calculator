import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { getOpponent } from 'app/runtime/player-opponent';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';


export class FoamSword extends Toy {
  name = 'Foam Sword';
  tier = 3;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    for (let i = 0; i < this.level; i++) {
      let lowestHealthResp = opponent.getLowestHealthPet();
      if (lowestHealthResp.pet == null) {
        return;
      }
      this.toyService.snipePet(
        lowestHealthResp.pet,
        5,
        this.parent,
        this.name,
        lowestHealthResp.random,
        puma,
      );
    }
  }
}


export class FoamSwordAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FoamSwordAbility',
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

    // Mirror Foam Sword toy behavior
    let opponent = owner.parent.opponent;
    for (let i = 0; i < this.level; i++) {
      let lowestHealthResp = opponent.getLowestHealthPet();
      owner.snipePet(lowestHealthResp.pet, 5, lowestHealthResp.random, tiger);
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FoamSwordAbility {
    return new FoamSwordAbility(newOwner, this.logService);
  }
}







