import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';


export class MagicMirror extends Toy {
  name = 'Magic Mirror';
  tier = 4;
}


export class MagicMirrorAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'MagicMirrorAbility',
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

    // Mirror Magic Mirror toy behavior (empty class - no effect)

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MagicMirrorAbility {
    return new MagicMirrorAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}

