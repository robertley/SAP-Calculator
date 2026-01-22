import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { getOpponent } from '../../../util/helper-functions';
import { Toy } from '../../toy.class';

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
