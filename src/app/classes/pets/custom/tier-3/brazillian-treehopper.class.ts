import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { BrazillianTreehopperAbility } from '../../../abilities/pets/custom/tier-3/brazillian-treehopper-ability.class';

export class BrazillianTreehopper extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Brazillian Treehopper';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 2;
    this.health = 3;
  }

  initAbilities(): void {
    this.abilityList = [new BrazillianTreehopperAbility(this, this.logService)];
    super.initAbilities();
  }
}
