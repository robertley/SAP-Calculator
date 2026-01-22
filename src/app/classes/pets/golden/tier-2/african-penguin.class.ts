import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { AfricanPenguinAbility } from '../../../abilities/pets/golden/tier-2/african-penguin-ability.class';

export class AfricanPenguin extends Pet {
  name = 'African Penguin';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 1;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new AfricanPenguinAbility(this, this.logService, this.abilityService),
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
