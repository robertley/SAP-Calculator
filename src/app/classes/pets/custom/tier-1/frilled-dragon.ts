import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { FrilledDragonAbility } from '../../../abilities/pets/custom/tier-1/frilled-dragon-ability.class';

export class FrilledDragon extends Pet {
  name = 'Frilled Dragon';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(new FrilledDragonAbility(this, this.logService));
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
