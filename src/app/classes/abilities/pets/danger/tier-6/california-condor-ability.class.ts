import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class CaliforniaCondorAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CaliforniaCondorAbility',
      owner: owner,
      triggers: ['FriendTransformed'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    let copyPet = triggerPet;

    if (!copyPet) {
      return;
    }

    this.logService.createLog({
      message: `California Condor copied ${copyPet.name}'s level ${owner.level} ability`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });
    owner.gainAbilities(copyPet, 'Pet');
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CaliforniaCondorAbility {
    return new CaliforniaCondorAbility(newOwner, this.logService);
  }
}
