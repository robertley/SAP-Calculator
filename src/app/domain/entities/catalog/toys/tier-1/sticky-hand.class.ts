import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Icky } from 'app/domain/entities/catalog/equipment/ailments/icky.class';
import { Toy } from '../../../toy.class';


export class StickyHand extends Toy {
  name = 'Sticky Hand';
  tier = 1;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    const targets = this.parent.getLastPets(2);
    for (const pet of targets.pets) {
      pet.givePetEquipment(new Icky());
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} Icky.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
        randomEvent: targets.random,
      });
    }
  }
}


