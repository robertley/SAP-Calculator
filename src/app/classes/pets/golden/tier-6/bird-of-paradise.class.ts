import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { BirdOfParadiseAbility } from '../../../abilities/pets/golden/tier-6/bird-of-paradise-ability.class';

export class BirdOfParadise extends Pet {
  name = 'Bird of Paradise';
  tier = 6;
  pack: Pack = 'Golden';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new BirdOfParadiseAbility(this, this.logService, this.abilityService),
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
