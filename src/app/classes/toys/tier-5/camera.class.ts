import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { getOpponent } from 'app/util/helper-functions';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class Camera extends Toy {
  name = 'Camera';
  tier = 5;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    for (let i = 0; i < this.level; i++) {
      let highestAttackPetResp = opponent.getHighestAttackPet();
      let target = highestAttackPetResp.pet;
      if (target == null) {
        return;
      }
      let power = 0.3;
      let reducedTo = Math.max(1, Math.floor(target.attack * (1 - power)));
      target.attack = reducedTo;
      this.logService.createLog({
        message: `${this.name} reduced ${target.name} attack by ${power * 100}% (${reducedTo})`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: highestAttackPetResp.random,
      });
    }
  }
}


export class CameraAbility extends Ability {
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CameraAbility',
      triggers: ['StartBattle'],
      owner: owner,
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        const { gameApi, puma } = context;
        let opponent = getOpponent(gameApi, owner.parent);
        for (let i = 0; i < this.abilityLevel; i++) {
          let highestAttackPetResp = opponent.getHighestAttackPet();
          let target = highestAttackPetResp.pet;
          if (target == null) {
            return;
          }
          let power = 0.3;
          let reducedTo = Math.max(1, Math.floor(target.attack * (1 - power)));
          target.attack = reducedTo;
          logService.createLog({
            message: `${owner.name} reduced ${target.name} attack by ${power * 100}% (${reducedTo}) (Camera)`,
            type: 'ability',
            player: owner.parent,
            puma: puma,
            randomEvent: highestAttackPetResp.random,
          });
        }
      },
    });
  }
}

