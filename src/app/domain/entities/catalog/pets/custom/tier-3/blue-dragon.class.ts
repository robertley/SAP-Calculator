import { Pet } from '../../../../pet.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class BlueDragon extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Blue Dragon';
    this.tier = 3;
    this.pack = 'Custom';
    this.attack = 3;
    this.health = 4;
  }

  initAbilities(): void {
    this.abilityList = [new BlueDragonAbility(this, this.logService)];
    super.initAbilities();
  }
}


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

    const friendsBehindResp = owner.parent.nearestPetsBehind(4, owner);
    const friendsBehind = friendsBehindResp.pets;
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
    const friendsAheadResp = owner.parent.nearestPetsAhead(4, owner);
    const friendsAhead = friendsAheadResp.pets;
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


