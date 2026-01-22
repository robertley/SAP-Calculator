import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class PangolinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PangolinAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.parent.toy != null;
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

    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }
    let target = targetsBehindResp.pets[0];
    let power = this.level * 4;
    target.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetsBehindResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PangolinAbility {
    return new PangolinAbility(newOwner, this.logService);
  }
}
