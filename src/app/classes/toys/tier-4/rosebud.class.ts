import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../pet.class';
import { Toy } from '../../toy.class';


export class Rosebud extends Toy {
  name = 'Rosebud';
  tier = 4;
  friendlyLevelUp(
    gameApi?: GameAPI,
    pet?: Pet,
    puma?: boolean,
    level?: number,
  ) {
    if (!puma) {
      this.triggers++;
    }

    if (this.triggers % 2 != 0) {
      return;
    }
    let targets = pet.parent.petArray.filter((p) => p.alive);
    for (let target of targets) {
      this.logService.createLog({
        message: `${this.name} gave ${target.name} ${level} attack and ${level} health.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
      target.increaseAttack(+level);
      target.increaseHealth(+level);
    }
  }
}
