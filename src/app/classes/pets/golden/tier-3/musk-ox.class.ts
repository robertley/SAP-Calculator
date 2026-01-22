import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { MuskOxAbility } from '../../../abilities/pets/golden/tier-3/musk-ox-ability.class';

export class MuskOx extends Pet {
  name = 'Musk Ox';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 2;
  health = 4;

  initAbilities(): void {
    this.addAbility(new MuskOxAbility(this, this.logService));
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
