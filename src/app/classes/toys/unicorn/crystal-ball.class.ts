import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';

export class CrystalBall extends Toy {
  name = 'Crystal Ball';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let target = this.parent.petArray[0];
    if (target == null) {
      return;
    }
    this.logService.createLog({
      message: `${this.name} gave ${target.name} ${this.level} mana.`,
      type: 'ability',
      player: this.parent,
      puma: puma,
      randomEvent: false,
    });
    target.increaseMana(this.level);
  }
}
