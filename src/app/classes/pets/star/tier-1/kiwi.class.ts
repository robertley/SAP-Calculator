import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { KiwiAbility } from '../../../abilities/pets/star/tier-1/kiwi-ability.class';

export class Kiwi extends Pet {
  name = 'Kiwi';
  tier = 1;
  pack: Pack = 'Star';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new KiwiAbility(this, this.logService));
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
