import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';

export class CashRegister extends Toy {
  name = 'Cash Register';
  tier = 4;
  onBreak(gameApi?: GameAPI) {
    // doesn't need to be programmed
  }
}
