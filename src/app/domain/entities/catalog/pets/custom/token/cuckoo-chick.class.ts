import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';


export class CuckooChick extends Pet {
  name = 'Cuckoo Chick';
  tier = 1;
  pack: Pack = 'Custom';
  hidden: boolean = true;
  attack = 1;
  health = 1;
  override increaseAttack(amt) {
    if (amt <= 0 || !this.alive) {
      return;
    }
    this.attack = Math.min(this.attack + amt, 1);
  }

  override increaseHealth(amt) {
    if (amt <= 0 || !this.alive) {
      return;
    }
    this.health = Math.min(this.health + amt, 1);
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
    // Correct parameter order for initPet: exp, health, attack, mana, equipment, triggersConsumed
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


