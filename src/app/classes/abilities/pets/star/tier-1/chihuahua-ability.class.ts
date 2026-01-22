import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class ChihuahuaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ChihuahuaAbility',
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const opponent = owner.parent.opponent;

    const targetInfo = opponent.getHighestHealthPet(undefined, owner);
    const target = targetInfo.pet;

    if (target) {
      const spaces = this.level;

      this.logService.createLog({
        message: `${owner.name} pushed ${target.name} forward ${spaces} space(s).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetInfo.random,
      });

      opponent.pushPet(target, spaces);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChihuahuaAbility {
    return new ChihuahuaAbility(newOwner, this.logService);
  }
}
