import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../../classes/equipment.class';
import { Pack, Pet } from '../../../../classes/pet.class';
import { Player } from '../../../../classes/player.class';
import { FarmerCrowAbility } from '../../../abilities/pets/custom/tier-5/farmer-crow-ability.class';

export class FarmerCrow extends Pet {
  name = 'Farmer Crow';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 6;
  health = 3;
  initAbilities(): void {
    this.addAbility(new FarmerCrowAbility(this, this.logService));
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
