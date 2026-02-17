import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class BlueDragon extends Pet {
  name = 'Blue Dragon';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }

  initAbilities(): void {
    this.addAbility(new BlueDragonAbility(this, this.logService));
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


