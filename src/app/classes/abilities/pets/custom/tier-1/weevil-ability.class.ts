import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class WeevilAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WeevilAbility',
      owner: owner,
      triggers: ['FoodEatenByFriendly'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    const target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.increaseAttack(this.level);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${this.level} attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WeevilAbility {
    return new WeevilAbility(newOwner, this.logService);
  }
}
