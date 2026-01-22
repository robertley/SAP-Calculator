import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Spooked } from '../../../equipment/ailments/spooked.class';
import { Weak } from '../../../equipment/ailments/weak.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { BarghestAbility } from '../../../abilities/pets/unicorn/tier-1/barghest-ability.class';

export class Barghest extends Pet {
  name = 'Barghest';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new BarghestAbility(this, this.logService));
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
