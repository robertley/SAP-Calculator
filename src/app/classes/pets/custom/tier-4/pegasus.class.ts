import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { PegasusAbility } from '../../../abilities/pets/custom/tier-4/pegasus-ability.class';

export class Pegasus extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Pegasus';
    this.tier = 4;
    this.pack = 'Custom';
    this.attack = 2;
    this.health = 4;
  }

  override initAbilities(): void {
    this.abilityList = [new PegasusAbility(this, this.logService)];
    super.initAbilities();
  }
}
