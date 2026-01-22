import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { OgopogoAbility } from '../../../abilities/pets/unicorn/tier-2/ogopogo-ability.class';

export class Ogopogo extends Pet {
  name = 'Ogopogo';
  tier = 2;
  pack: Pack = 'Unicorn';
  attack = 3;
  health = 1;
  initAbilities(): void {
    this.addAbility(new OgopogoAbility(this, this.logService));
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
