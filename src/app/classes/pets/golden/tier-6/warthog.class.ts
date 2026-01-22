import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { WarthogAbility } from '../../../abilities/pets/golden/tier-6/warthog-ability.class';

export class Warthog extends Pet {
  name = 'Warthog';
  tier = 6;
  pack: Pack = 'Golden';
  attack = 9;
  health = 6;
  initAbilities(): void {
    this.addAbility(new WarthogAbility(this, this.logService));
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
