import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { PetService } from '../../../../services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { HarpyEagleAbility } from '../../../abilities/pets/custom/tier-6/harpy-eagle-ability.class';

export class HarpyEagle extends Pet {
  name = 'Harpy Eagle';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 6;
  initAbilities(): void {
    this.addAbility(
      new HarpyEagleAbility(this, this.logService, this.petService),
    );
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
