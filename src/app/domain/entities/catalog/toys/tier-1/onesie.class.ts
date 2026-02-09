import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Cold } from 'app/domain/entities/catalog/equipment/ailments/cold.class';
import { Toy } from '../../../toy.class';
import { Pet } from '../../../pet.class';


export class Onesie extends Toy {
  name = 'Onesie';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const chosen: Pet[] = [];

    for (let i = 0; i < 2; i++) {
      const targetResp = this.parent.getRandomPet(chosen);
      if (!targetResp.pet) {
        return;
      }
      chosen.push(targetResp.pet);
      targetResp.pet.givePetEquipment(new Cold());
      this.logService.createLog({
        message: `${this.name} gave ${targetResp.pet.name} Cold.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: targetResp.random,
      });
    }
  }
}


