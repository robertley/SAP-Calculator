import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';

export class Radio extends Toy {
  name = 'Radio';
  tier = 2;
  onBreak(gameApi?: GameAPI, puma?: boolean) {
    let pets = this.parent.petArray;
    for (let pet of pets) {
      if (!pet.alive) {
        continue;
      }
      pet.increaseHealth(this.level);
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} ${this.level} health.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}
