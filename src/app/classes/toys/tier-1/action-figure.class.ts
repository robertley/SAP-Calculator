import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { getOpponent } from '../../../util/helper-functions';
import { Coconut } from '../../equipment/turtle/coconut.class';
import { Toy } from '../../toy.class';

export class ActionFigure extends Toy {
  name = 'Action Figure';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const opponent = getOpponent(gameApi, this.parent);
    const targets = opponent.getFurthestUpPets(2);
    for (const pet of targets.pets) {
      pet.givePetEquipment(new Coconut());
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} Coconut.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: targets.random,
      });
    }
  }
}
