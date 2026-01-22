import { GameAPI } from '../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { ToyService } from '../../../services/toy/toy.service';
import { Pet } from '../../pet.class';
import { GiantEyesDog } from '../../pets/hidden/giant-eyes-dog.class';
import { SalmonOfKnowledge } from '../../pets/unicorn/tier-5/salmon-of-knowledge.class';
import { Player } from '../../player.class';
import { Toy } from '../../toy.class';

export class TinderBox extends Toy {
  name = 'Tinder Box';
  tier = 4;
  emptyFromSpace(
    gameApi?: GameAPI,
    puma?: boolean,
    level?: number,
    priority?: number,
  ) {
    let power = {
      attack: level * 6,
      health: level * 6,
    };
    let exp = level == 1 ? 0 : level == 2 ? 2 : 5;

    let giantEyesDog = new GiantEyesDog(
      this.logService,
      this.abilityService,
      this.parent,
      power.health,
      power.attack,
      0,
      exp,
    );
    let message = `${this.name} spawned Giant Eyes Dog (${power.attack}/${power.health}).`;

    if (this.parent.summonPet(giantEyesDog, 0).success) {
      this.logService.createLog({
        message: message,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }

    this.used = true;
  }

  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    protected abilityService: AbilityService,
    parent: Player,
    level: number,
  ) {
    super(logService, toyService, parent, level);
  }
}
