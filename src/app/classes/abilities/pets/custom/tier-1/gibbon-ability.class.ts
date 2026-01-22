import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';

export class GibbonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'GibbonAbility',
      owner: owner,
      triggers: ['ShopUpgrade'],
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

    let power = this.level;
    let targetsBehindResp = owner.parent.nearestPetsBehind(2, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }

    for (let targetPet of targetsBehindResp.pets) {
      targetPet.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} ${power} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsBehindResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GibbonAbility {
    return new GibbonAbility(newOwner, this.logService, this.abilityService);
  }
}
