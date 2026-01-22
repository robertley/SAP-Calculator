import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { Equipment } from '../../equipment.class';
import { Pack, Pet } from '../../pet.class';
import { Player } from '../../player.class';
import { LoyalChinchillaAbility } from '../../abilities/pets/hidden/loyal-chinchilla-ability.class';

export class LoyalChinchilla extends Pet {
  name = 'Loyal Chinchilla';
  tier = 1;
  pack: Pack = 'Puppy';
  hidden: boolean = true;
  health = 2;
  attack = 2;
  initAbilities(): void {
    this.addAbility(
      new LoyalChinchillaAbility(this, this.logService, this.abilityService),
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
