import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { SwordFishAbility } from '../../../abilities/pets/star/tier-5/sword-fish-ability.class';

export class SwordFish extends Pet {
  name = 'Swordfish';
  tier = 5;
  pack: Pack = 'Star';
  attack = 5;
  health = 5;

  initAbilities(): void {
    this.addAbility(new SwordFishAbility(this, this.logService));
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
