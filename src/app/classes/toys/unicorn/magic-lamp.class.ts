import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Pet } from '../../pet.class';
import { Toy } from '../../toy.class';

export class MagicLamp extends Toy {
  name = 'Magic Lamp';
  tier = 2;
  friendlyLevelUp(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  ) {
    this.logService.createLog({
      message: `${this.name} gave ${pet.name} ${level} attack and ${level} health.`,
      type: 'ability',
      player: this.parent,
      puma: puma,
    });
    pet.increaseAttack(+level);
    pet.increaseHealth(+level);
  }
}
