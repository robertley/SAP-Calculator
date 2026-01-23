import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Flounder extends Pet {
  name = 'Flounder';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(new FlounderAbility(this, this.logService));
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


export class FlounderAbility extends Ability {
  private logService: LogService;
  private foodsEaten = 0;
  private triggeredThisTurn = false;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Flounder Ability',
      owner: owner,
      triggers: ['FoodEatenByThis', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;

    if (context.trigger === 'StartTurn') {
      this.foodsEaten = 0;
      this.triggeredThisTurn = false;
      this.triggerTigerExecution(context);
      return;
    }

    if (this.triggeredThisTurn) {
      this.triggerTigerExecution(context);
      return;
    }

    this.foodsEaten++;

    if (this.foodsEaten < 2) {
      this.triggerTigerExecution(context);
      return;
    }

    const expGain = this.level;
    const targetsResp = owner.parent.nearestPetsBehind(2, owner);
    for (const target of targetsResp.pets) {
      target.increaseExp(expGain);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${expGain} exp.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    this.triggeredThisTurn = true;
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FlounderAbility {
    return new FlounderAbility(newOwner, this.logService);
  }
}
