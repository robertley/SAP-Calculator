import { cloneDeep, shuffle } from 'lodash-es';
import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { CockatooAbility } from '../../../abilities/pets/golden/tier-4/cockatoo-ability.class';

export class Cockatoo extends Pet {
  name = 'Cockatoo';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 4;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new CockatooAbility(this, this.logService, this.abilityService),
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
