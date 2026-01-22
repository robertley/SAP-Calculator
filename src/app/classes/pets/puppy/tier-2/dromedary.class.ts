import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { DromedaryAbility } from '../../../abilities/pets/puppy/tier-2/dromedary-ability.class';

export class Dromedary extends Pet {
  name = 'Dromedary';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new DromedaryAbility(this, this.logService, this.abilityService),
    );
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
