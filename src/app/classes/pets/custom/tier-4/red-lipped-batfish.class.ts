import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from '../../../../services/pet/pet.service';
import { RedLippedBatfishAbility } from '../../../abilities/pets/custom/tier-4/red-lipped-batfish-ability.class';

export class RedLippedBatfish extends Pet {
  name = 'Red Lipped Batfish';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 5;
  health = 3;

  initAbilities(): void {
    this.addAbility(
      new RedLippedBatfishAbility(this, this.logService, this.petService),
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
