import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { getOpponent } from 'app/runtime/player-opponent';
import { Toy } from '../../../toy.class';


export class ChocolateBox extends Toy {
  name = 'Chocolate Box';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const opponent = getOpponent(gameApi, this.parent);

    for (const pet of this.parent.petArray) {
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} 1 exp.`,
        type: 'ability',
        player: this.parent,
        targetPet: pet,
        puma: puma,
      });
      pet.increaseExp(1);
    }

    for (const pet of opponent.petArray) {
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} 2 exp.`,
        type: 'ability',
        player: this.parent,
        targetPet: pet,
        puma: puma,
      });
      pet.increaseExp(2);
    }
  }
}




