import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Power } from 'app/interfaces/power.interface';
import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Mosasaurus extends Pet {
  name = 'Mosasaurus';
  tier = 5;
  pack: Pack = 'Puppy';
  attack = 5;
  health = 6;
  friendlyToyBroke(gameApi: GameAPI, tiger?: boolean): void {
    let targets = [];
    let randomEvent = false;

    // Target ahead with Silly-aware targeting
    let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
    if (targetsAheadResp.pets.length > 0) {
      targets.push(targetsAheadResp.pets[0]);
      randomEvent = targetsAheadResp.random;
    }

    // Target behind with Silly-aware targeting
    let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
    if (targetsBehindResp.pets.length > 0) {
      targets.push(targetsBehindResp.pets[0]);
      randomEvent = randomEvent || targetsBehindResp.random;
    }

    if (targets.length == 0) {
      return;
    }
    let power: Power = {
      attack: 2,
      health: 3,
    };
    for (let target of targets) {
      this.logService.createLog({
        message: `${this.name} gave ${target.name} ${power.attack} attach and ${power.health} health.`,
        type: 'ability',
        player: this.parent,
        randomEvent: randomEvent,
        tiger: tiger,
      });
      target.increaseHealth(power.health);
      target.increaseAttack(power.attack);
    }
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


export class MosasaurusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'MosasaurusAbility',
      owner: owner,
      triggers: [],
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
    // Empty implementation - to be filled by user
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MosasaurusAbility {
    return new MosasaurusAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
