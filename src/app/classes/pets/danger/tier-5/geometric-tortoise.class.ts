import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { GeometricTortoiseAbility } from '../../../abilities/pets/danger/tier-5/geometric-tortoise-ability.class';

export class GeometricTortoise extends Pet {
  name = 'Geometric Tortoise';
  tier = 5;
  pack: Pack = 'Danger';
  attack = 3;
  health = 10;

  initAbilities(): void {
    this.addAbility(new GeometricTortoiseAbility(this, this.logService));
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
