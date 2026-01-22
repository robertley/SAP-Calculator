import { PetService } from '../../../../services/pet/pet.service';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { CaliforniaCondorAbility } from '../../../abilities/pets/danger/tier-6/california-condor-ability.class';
export class CaliforniaCondor extends Pet {
  name = 'California Condor';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 10;
  health = 6;

  initAbilities(): void {
    this.addAbility(new CaliforniaCondorAbility(this, this.logService));
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
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
