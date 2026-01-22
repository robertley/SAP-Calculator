import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { ElephantAbility } from '../../../abilities/pets/turtle/tier-3/elephant-ability.class';

export class Elephant extends Pet {
  name = 'Elephant';
  tier = 3;
  pack: Pack = 'Turtle';
  health = 7;
  attack = 3;
  initAbilities(): void {
    this.addAbility(new ElephantAbility(this, this.logService));
    super.initAbilities();
  }
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
