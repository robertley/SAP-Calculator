import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';


export class CuckooChick extends Pet {
  name = 'Cuckoo Chick';
  tier = 1;
  pack: Pack = 'Custom';
  hidden: boolean = true;
  attack = 1;
  health = 1;

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
    // Correct parameter order for initPet: exp, health, attack, mana, equipment, triggersConsumed
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}
