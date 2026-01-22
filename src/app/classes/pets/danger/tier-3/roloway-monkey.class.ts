import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from '../../../../services/pet/pet.service';
import { RolowayMonkeyAbility } from '../../../abilities/pets/danger/tier-3/roloway-monkey-ability.class';

export class RolowayMonkey extends Pet {
  name = 'Roloway Monkey';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 2;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new RolowayMonkeyAbility(this, this.logService, this.petService),
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
