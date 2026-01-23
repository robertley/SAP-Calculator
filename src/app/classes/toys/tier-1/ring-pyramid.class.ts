import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';


export class RingPyramid extends Toy {
  name = 'Ring Pyramid';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const turnNumber = gameApi?.turnNumber ?? 1;
    let currentTier = 1;
    if (turnNumber > 2) currentTier = 2;
    if (turnNumber > 4) currentTier = 3;
    if (turnNumber > 6) currentTier = 4;
    if (turnNumber > 8) currentTier = 5;
    if (turnNumber > 10) currentTier = 6;
    const previousTier = currentTier - 1;
    if (previousTier < 1) {
      return;
    }

    for (const pet of this.parent.petArray) {
      if (pet.tier === previousTier) {
        pet.health = 0;
        this.logService.createLog({
          message: `${this.name} knocked out ${pet.name}.`,
          type: 'ability',
          player: this.parent,
          puma: puma,
        });
      }
    }
  }
}
