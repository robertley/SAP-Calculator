import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../../classes/equipment.class';
import { Pack, Pet } from '../../../../classes/pet.class';
import { Player } from '../../../../classes/player.class';
import { DugongAbility } from '../../../abilities/pets/custom/tier-3/dugong-ability.class';

export class Dugong extends Pet {
  name = 'Dugong';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 5;

  override initAbilities(): void {
    this.addAbility(new DugongAbility(this, this.logService));
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
