import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SeahorseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SeahorseAbility',
      owner: owner,
      triggers: ['StartBattle'],
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const opponent = owner.parent.opponent;
    const targetResp = opponent.getLastPet();

    if (targetResp.pet == null) {
      return;
    }

    const target = targetResp.pet;
    // Push the target within its own team
    target.parent.pushPet(target, this.level);

    this.logService.createLog({
      message: `${owner.name} pushed ${target.name} forward ${this.level} space(s).`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SeahorseAbility {
    return new SeahorseAbility(newOwner, this.logService);
  }
}
