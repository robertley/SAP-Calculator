import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { PetService } from '../../../../services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { IriomoteCatAbility } from '../../../abilities/pets/danger/tier-1/iriomote-cat-ability.class';

export class IriomoteCat extends Pet {
  name = 'Iriomote Cat';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new IriomoteCatAbility(this, this.logService, this.petService),
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
