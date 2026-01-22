import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { LongcombSawfishAbility } from '../../../abilities/pets/danger/tier-4/longcomb-sawfish-ability.class';

export class LongcombSawfish extends Pet {
  name = 'Longcomb Sawfish';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 3;
  health = 3;

  initAbilities(): void {
    this.addAbility(new LongcombSawfishAbility(this, this.logService));
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
