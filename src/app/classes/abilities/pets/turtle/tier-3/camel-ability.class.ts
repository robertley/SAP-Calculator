import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class CamelAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CamelAbility',
      owner: owner,
      triggers: ['ThisHurt'],
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

    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }

    let boostPet = targetsBehindResp.pets[0];
    let boostAmt = this.level * 2;
    boostPet.increaseAttack(this.level);
    boostPet.increaseHealth(boostAmt);
    this.logService.createLog({
      message: `${owner.name} gave ${boostPet.name} ${this.level} attack and ${boostAmt} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsBehindResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CamelAbility {
    return new CamelAbility(newOwner, this.logService);
  }
}
