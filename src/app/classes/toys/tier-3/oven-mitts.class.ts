import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { Toy } from '../../toy.class';

export class OvenMitts extends Toy {
  name = 'Oven Mitts';
  tier = 4;
  onBreak(gameApi?: GameAPI) {
    // doesn't need to be programmed
  }
}
