import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Spooked } from '../../../equipment/ailments/spooked.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';

export class QuestionMarks extends Pet {
  name = '???';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 3;
  health = 2;

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}
