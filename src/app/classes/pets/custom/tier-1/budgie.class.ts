import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../../classes/equipment.class';
import { Pack, Pet } from '../../../../classes/pet.class';
import { Player } from '../../../../classes/player.class';
import { BudgieAbility } from '../../../abilities/pets/custom/tier-1/budgie-ability.class';

export class Budgie extends Pet {
  name = 'Budgie';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(new BudgieAbility(this, this.logService));
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
