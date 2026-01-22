import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { UnicornAbility } from '../../../abilities/pets/unicorn/tier-4/unicorn-ability.class';

export class Unicorn extends Pet {
  name = 'Unicorn';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 4;

  initAbilities(): void {
    this.addAbility(new UnicornAbility(this, this.logService));
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
