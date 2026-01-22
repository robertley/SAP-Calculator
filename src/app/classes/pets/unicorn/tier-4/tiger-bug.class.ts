import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { TigerBugAbility } from '../../../abilities/pets/unicorn/tier-4/tiger-bug-ability.class';

export class TigerBug extends Pet {
  name = 'Tiger Bug';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new TigerBugAbility(this, this.logService));
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
