import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { FireAntAbility } from '../../../abilities/pets/golden/tier-5/fire-ant-ability.class';

export class FireAnt extends Pet {
  name = 'Fire Ant';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 8;
  health = 3;
  initAbilities(): void {
    this.addAbility(new FireAntAbility(this, this.logService));
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
