import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { getOpponent } from '../../../../util/helper-functions';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { GoldfishAbility } from '../../../abilities/pets/puppy/tier-2/goldfish-ability.class';

export class Goldfish extends Pet {
  name = 'Goldfish';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(
      new GoldfishAbility(this, this.logService, this.abilityService),
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
