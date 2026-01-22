import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Player } from '../../../player.class';
import { Pet, Pack } from '../../../pet.class';
import { Equipment } from '../../../equipment.class';
import { TermiteAbility } from '../../../abilities/pets/custom/tier-1/termite-ability.class';

export class Termite extends Pet {
  name = 'Termite';
  tier = 1;
  pack: Pack = 'Custom';
  health = 4;
  attack = 1;
  initAbilities(): void {
    this.addAbility(
      new TermiteAbility(this, this.logService, this.abilityService),
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
