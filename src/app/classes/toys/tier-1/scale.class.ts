import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';

export class Scale extends Toy {
  name = 'Scale';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const turnNumber = gameApi?.turnNumber ?? 1;
    for (const pet of this.parent.petArray) {
      const attackDelta = turnNumber - pet.attack;
      const healthDelta = turnNumber - pet.health;
      if (attackDelta !== 0) {
        pet.increaseAttack(attackDelta);
      }
      if (healthDelta !== 0) {
        pet.increaseHealth(healthDelta);
      }
      this.logService.createLog({
        message: `${this.name} set ${pet.name} to ${turnNumber}/${turnNumber}.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}
