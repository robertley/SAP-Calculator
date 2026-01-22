import { Ability, AbilityContext } from '../../../ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';

export class RadioAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RadioAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Radio toy behavior (onBreak effect)
    let targetsResp = owner.parent.getAll(false, owner, true);
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      pet.increaseHealth(this.level);
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} ${this.level} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RadioAbility {
    return new RadioAbility(newOwner, this.logService);
  }
}
