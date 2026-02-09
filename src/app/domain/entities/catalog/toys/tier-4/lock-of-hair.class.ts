import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';


export class LockOfHair extends Toy {
  name = 'Lock of Hair';
  tier = 4;
}


export class LockOfHairAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'LockOfHairAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Lock of Hair toy behavior (empty class - no effect)

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LockOfHairAbility {
    return new LockOfHairAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}



