import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class MeerkatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MeerkatAbility',
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

    let gold;
    if (owner.parent == gameApi.player) {
      gold = gameApi.playerGoldSpent;
    } else {
      gold = gameApi.opponentGoldSpent;
    }
    let power = Math.floor(gold / 4) * this.level;

    // Get pets ahead and behind with Silly-aware targeting
    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
    let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);

    if (targetsAheadResp.pets.length > 0) {
      let targetAhead = targetsAheadResp.pets[0];
      targetAhead.increaseAttack(power);
      this.logService.createLog({
        message: `${owner.name} gave ${targetAhead.name} ${power} attack.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsAheadResp.random,
      });
    }

    if (targetsBehindResp.pets.length > 0) {
      let targetBehind = targetsBehindResp.pets[0];
      targetBehind.increaseAttack(power);
      this.logService.createLog({
        message: `${owner.name} gave ${targetBehind.name} ${power} attack.`,
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

  copy(newOwner: Pet): MeerkatAbility {
    return new MeerkatAbility(newOwner, this.logService);
  }
}
