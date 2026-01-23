import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { getOpponent } from 'app/util/helper-functions';
import { Toy } from '../../toy.class';


export class RemoteCar extends Toy {
  name = 'Remote Car';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const opponent = getOpponent(gameApi, this.parent);
    for (const pet of opponent.petArray) {
      const attackGain = Math.floor(pet.attack * 0.2);
      const healthGain = Math.floor(pet.health * 0.2);
      if (attackGain > 0) {
        pet.increaseAttack(attackGain);
      }
      if (healthGain > 0) {
        pet.increaseHealth(healthGain);
      }
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} +${attackGain}/+${healthGain}.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}
