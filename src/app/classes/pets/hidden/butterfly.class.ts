import { AbilityService } from '../../../services/ability/ability.service';
import { LogService } from '../../../services/log.service';
import { Equipment } from '../../equipment.class';
import { Pack, Pet } from '../../pet.class';
import { Player } from '../../player.class';
import { ButterflyAbility } from '../../abilities/pets/hidden/butterfly-ability.class';

export class Butterfly extends Pet {
  name = 'Butterly';
  tier = 1;
  pack: Pack = 'Puppy';
  hidden: boolean = true;
  health = 1;
  attack = 1;
  initAbilities(): void {
    this.addAbility(new ButterflyAbility(this, this.logService));
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
