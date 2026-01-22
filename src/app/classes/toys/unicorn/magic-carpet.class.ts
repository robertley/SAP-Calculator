import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Pet } from '../../pet.class';
import { Toy } from '../../toy.class';

export class MagicCarpet extends Toy {
  name = 'Magic Carpet';
  tier = 2;
  friendSummoned(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
    this.logService.createLog({
      message: `${this.name} gave ${pet.name} ${level} attack.`,
      type: 'ability',
      player: this.parent,
      puma: puma,
    });
    pet.increaseAttack(level);
  }
}
