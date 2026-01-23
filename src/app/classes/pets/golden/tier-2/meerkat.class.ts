import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Meerkat extends Pet {
  name = 'Meerkat';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 1;
  health = 2;
  initAbilities(): void {
    this.addAbility(new MeerkatAbility(this, this.logService));
    super.initAbilities();
  }
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
}


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
