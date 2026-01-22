import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { BasiliskAbility } from '../../../abilities/pets/custom/tier-1/basilisk-ability.class';

export class Basilisk extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Basilisk';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 5;
    this.health = 2;
  }

  override initAbilities(): void {
    this.abilityList = [
      new BasiliskAbility(this, this.logService, this.abilityService),
    ];
    super.initAbilities();
  }
}
