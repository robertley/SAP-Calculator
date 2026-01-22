import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class AtlanticPuffinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AtlanticPuffinAbility',
      owner: owner,
      triggers: ['FriendAttacked'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (!triggerPet || triggerPet.equipment?.name != 'Strawberry') {
          return false;
        }
        return true;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    this.logService.createLog({
      message: `${owner.name} removed ${triggerPet.name}'s ${triggerPet.equipment.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    triggerPet.removePerk();
    let power = 2 * owner.level;
    let targetResp = owner.parent.opponent.getLastPet();
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    owner.snipePet(target, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AtlanticPuffinAbility {
    return new AtlanticPuffinAbility(newOwner, this.logService);
  }
}
