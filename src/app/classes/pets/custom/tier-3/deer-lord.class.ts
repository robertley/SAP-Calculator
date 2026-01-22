import { getOpponent } from 'app/util/helper-functions';
import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { DeerLordAbility } from '../../../abilities/pets/custom/tier-3/deer-lord-ability.class';

export class DeerLord extends Pet {
  name = 'Deer Lord';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  override initAbilities(): void {
    this.addAbility(new DeerLordAbility(this, this.logService));
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
