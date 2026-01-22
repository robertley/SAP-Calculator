import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PengobbleAbility } from '../../../abilities/pets/unicorn/tier-1/pengobble-ability.class';

export class Pengobble extends Pet {
  name = 'Pengobble';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 1;
  health = 4;
  initAbilities(): void {
    this.addAbility(new PengobbleAbility(this, this.logService));
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
