import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../../classes/equipment.class';
import { Pack, Pet } from '../../../../classes/pet.class';
import { Player } from '../../../../classes/player.class';
import { DesertRainFrogAbility } from '../../../abilities/pets/custom/tier-2/desert-rain-frog-ability.class';

export class DesertRainFrog extends Pet {
  name = 'Desert Rain Frog';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new DesertRainFrogAbility(this, this.logService));
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
