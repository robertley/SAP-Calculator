import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';


export class OvenMitts extends Toy {
  name = 'Oven Mitts';
  tier = 4;
  onBreak(gameApi?: GameAPI) {
    // doesn't need to be programmed
  }
}


export class OvenMittsAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'OvenMittsAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {}

  copy(newOwner: Pet): OvenMittsAbility {
    return new OvenMittsAbility(newOwner, this.logService);
  }
}



