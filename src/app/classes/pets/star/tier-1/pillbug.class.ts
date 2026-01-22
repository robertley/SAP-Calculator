import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PillbugAbility } from '../../../abilities/pets/star/tier-1/pillbug-ability.class';

export class Pillbug extends Pet {
  name = 'Pillbug';
  tier = 1;
  pack: Pack = 'Star';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new PillbugAbility(this, this.logService, this.abilityService),
    );
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
