import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { getOpponent } from '../../../util/helper-functions';
import { Toy } from '../../toy.class';

export class ChocolateBox extends Toy {
  name = 'Chocolate Box';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const opponent = getOpponent(gameApi, this.parent);

    for (const pet of this.parent.petArray) {
      pet.increaseExp(1);
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} 1 exp.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }

    for (const pet of opponent.petArray) {
      pet.increaseExp(2);
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} 2 exp.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}
