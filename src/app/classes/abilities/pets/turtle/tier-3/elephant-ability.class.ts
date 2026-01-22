import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class ElephantAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ElephantAbility',
      owner: owner,
      triggers: ['ThisAttacked'],
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

    for (let i = 0; i < this.level; i++) {
      let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
      if (targetsBehindResp.pets.length > 0) {
        let target = targetsBehindResp.pets[0];
        owner.snipePet(target, 1, targetsBehindResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ElephantAbility {
    return new ElephantAbility(newOwner, this.logService);
  }
}
