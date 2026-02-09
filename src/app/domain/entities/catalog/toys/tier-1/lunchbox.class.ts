import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';


export class Lunchbox extends Toy {
  name = 'Lunchbox';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const turnNumber = gameApi?.turnNumber ?? 1;
    for (let i = 0; i < turnNumber; i++) {
      const targetResp = this.parent.getRandomLivingPet();
      if (!targetResp.pet) {
        return;
      }

      const target = targetResp.pet;
      const isEnemy = target.parent !== this.parent;
      const power = isEnemy ? 2 : 1;
      target.increaseAttack(power);
      target.increaseHealth(power);

      this.logService.createLog({
        message: `${this.name} fed ${target.name} +${power}/+${power}.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: targetResp.random,
      });
    }
  }
}
