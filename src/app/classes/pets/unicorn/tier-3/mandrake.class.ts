import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Dazed } from '../../../equipment/ailments/dazed.class';
import { shuffle } from '../../../../util/helper-functions';
import { MandrakeAbility } from '../../../abilities/pets/unicorn/tier-3/mandrake-ability.class';

export class Mandrake extends Pet {
  name = 'Mandrake';
  tier = 3;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new MandrakeAbility(this, this.logService));
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
