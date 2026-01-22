import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class SurgeonFishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SurgeonFishAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (owner.parent.trumpets < 2) {
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

    let targetsBehindResp = owner.parent.nearestPetsBehind(2, owner);
    let targets = targetsBehindResp.pets;
    if (targets.length == 0) {
      return;
    }

    owner.parent.spendTrumpets(2, owner);
    let power = this.level * 4;

    for (let target of targets) {
      target.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${power} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsBehindResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SurgeonFishAbility {
    return new SurgeonFishAbility(newOwner, this.logService);
  }
}
