import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';


export class Kite extends Toy {
  name = 'Kite';
  tier = 1;
  emptyFromSpace(
    gameApi?: GameAPI,
    puma?: boolean,
    level?: number,
    priority?: number,
  ) {
    const targetResp = this.parent.getLastPet();
    if (!targetResp.pet) {
      return;
    }

    const pet = targetResp.pet;
    const attackLoss = Math.floor(pet.attack * 0.2);
    if (attackLoss > 0) {
      pet.increaseAttack(-attackLoss);
    }
    this.parent.pushPetToFront(pet);

    this.logService.createLog({
      message: `${this.name} moved ${pet.name} to the front and removed ${attackLoss} attack.`,
      type: 'ability',
      player: this.parent,
      puma: puma,
    });

    this.used = true;
  }
}
