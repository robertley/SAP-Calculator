import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { AxehandleHoundAbility } from '../../../abilities/pets/custom/tier-3/axehandle-hound-ability.class';

export class AxehandleHound extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Axehandle Hound';
    this.attack = 4;
    this.health = 3;
    this.tier = 3;
    this.pack = 'Custom';
  }

  override initAbilities(): void {
    this.abilityList = [new AxehandleHoundAbility(this, this.logService)];
    super.initAbilities();
  }
}
