import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { getOpponent } from '../../../util/helper-functions';
import { Toy } from '../../toy.class';

export class ToyGun extends Toy {
  name = 'Toy Gun';
  tier = 3;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    for (let i = 0; i < this.level; i++) {
      let targetResp = opponent.getLastPet();
      if (targetResp.pet == null) {
        return;
      }
      this.toyService.snipePet(
        targetResp.pet,
        5,
        this.parent,
        this.name,
        false,
        puma,
      );
    }
  }
}
