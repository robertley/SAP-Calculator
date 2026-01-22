import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { EgyptianVultureAbility } from 'app/classes/abilities/pets/golden/tier-4/egyptian-vulture-ability.class';

export class EgyptianVulture extends Pet {
  name = 'Egyptian Vulture';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 7;
  health = 4;
  initAbilities(): void {
    this.addAbility(new EgyptianVultureAbility(this, this.logService));
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
