import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PoodleAbility } from '../../../abilities/pets/custom/tier-6/poodle-ability.class';

export class Poodle extends Pet {
  name = 'Poodle';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;

  initAbilities(): void {
    this.addAbility(new PoodleAbility(this, this.logService));
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
