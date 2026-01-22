import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Icky } from '../../../equipment/ailments/icky.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { VisitorAbility } from '../../../abilities/pets/unicorn/tier-4/visitor-ability.class';

export class Visitor extends Pet {
  name = 'Visitor';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 7;
  health = 5;
  initAbilities(): void {
    this.addAbility(new VisitorAbility(this, this.logService));
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
