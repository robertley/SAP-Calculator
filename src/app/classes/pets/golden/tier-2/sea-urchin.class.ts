import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { SeaUrchinAbility } from '../../../abilities/pets/golden/tier-2/sea-urchin-ability.class';

export class SeaUrchin extends Pet {
  name = 'Sea Urchin';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new SeaUrchinAbility(this, this.logService));
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
