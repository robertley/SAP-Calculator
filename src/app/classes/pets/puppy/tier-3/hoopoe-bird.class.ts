import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { HoopoeBirdAbility } from '../../../abilities/pets/puppy/tier-3/hoopoe-bird-ability.class';

export class HoopoeBird extends Pet {
  name = 'Hoopoe Bird';
  tier = 3;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new HoopoeBirdAbility(this, this.logService));
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
