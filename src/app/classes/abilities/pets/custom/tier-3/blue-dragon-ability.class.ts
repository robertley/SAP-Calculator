import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class BlueDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Blue Dragon Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const friendsBehind = owner.getPetsBehind(4);
    const trumpets = friendsBehind.length * this.level;
    if (trumpets > 0) {
      const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
      trumpetTargetResp.player.gainTrumpets(
        trumpets,
        owner,
        pteranodon,
        undefined,
        undefined,
        trumpetTargetResp.random,
      );
    }

    const manaGain = this.level;
    const friendsAhead = owner.getPetsAhead(4);
    if (friendsAhead.length > 0) {
      friendsAhead.forEach((friend) => friend.increaseMana(manaGain));
      this.logService.createLog({
        message: `${owner.name} gave ${friendsAhead.length} friend${friendsAhead.length === 1 ? '' : 's'} ahead +${manaGain} mana at StartBattle.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): BlueDragonAbility {
    return new BlueDragonAbility(newOwner, this.logService);
  }
}
