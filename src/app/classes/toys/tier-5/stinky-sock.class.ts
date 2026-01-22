import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { getOpponent } from '../../../util/helper-functions';
import { Toy } from '../../toy.class';

export class StinkySock extends Toy {
  name = 'Stinky Sock';
  tier = 5;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let opponent = getOpponent(gameApi, this.parent);
    for (let i = 0; i < this.level; i++) {
      let highestHealthPetResp = opponent.getHighestHealthPet();
      let target = highestHealthPetResp.pet;
      if (target == null) {
        return;
      }
      let power = 0.4;
      let reducedTo = Math.max(1, Math.floor(target.health * (1 - power)));
      target.health = reducedTo;
      this.logService.createLog({
        message: `${this.name} reduced ${target.name} health by ${power * 100}% (${reducedTo})`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: highestHealthPetResp.random,
      });
    }
  }
}
