import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../../classes/equipment.class';
import { Pack, Pet } from '../../../../classes/pet.class';
import { Player } from '../../../../classes/player.class';
import { DeinocheirusAbility } from '../../../abilities/pets/custom/tier-4/deinocheirus-ability.class';

export class Deinocheirus extends Pet {
  name = 'Deinocheirus';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 4;
  health = 7;
  override initAbilities(): void {
    this.addAbility(new DeinocheirusAbility(this, this.logService));
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
