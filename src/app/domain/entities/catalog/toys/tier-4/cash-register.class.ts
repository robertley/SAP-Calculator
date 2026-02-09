import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';


export class CashRegister extends Toy {
  name = 'Cash Register';
  tier = 4;
  onBreak(gameApi?: GameAPI) {
    // doesn't need to be programmed
  }
}


export class CashRegisterAbility extends Ability {
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CashRegisterAbility',
      triggers: [],
      owner: owner,
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        // Placeholder for Cash Register ability
      },
    });
  }
}



