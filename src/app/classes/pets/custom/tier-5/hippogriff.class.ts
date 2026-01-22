import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from '../../../../services/pet/pet.service';
import { HippogriffAbility } from '../../../abilities/pets/custom/tier-5/hippogriff-ability.class';

export class Hippogriff extends Pet {
  name = 'Hippogriff';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new HippogriffAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
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
