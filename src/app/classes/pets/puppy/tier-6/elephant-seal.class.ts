import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { ElephantSealAbility } from '../../../abilities/pets/puppy/tier-6/elephant-seal-ability.class';

export class ElephantSeal extends Pet {
  name = 'Elephant Seal';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 4;
  health = 8;
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
    this.addAbility(new ElephantSealAbility(this, this.logService));
    super.initAbilities();
  }
}
