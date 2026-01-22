import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { getOpponent } from '../../../../util/helper-functions';
import { Equipment } from '../../../equipment.class';
import { Weak } from '../../../equipment/ailments/weak.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { WhaleSharkAbility } from '../../../abilities/pets/puppy/tier-4/whale-shark-ability.class';

export class WhaleShark extends Pet {
  name = 'Whale Shark';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 6;
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
  initAbilities(): void {
    this.addAbility(
      new WhaleSharkAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }
}
