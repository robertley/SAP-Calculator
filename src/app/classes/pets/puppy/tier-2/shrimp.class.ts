import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Shrimp extends Pet {
  name = 'Shrimp';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new ShrimpAbility(this, this.logService, this.abilityService),
    );
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


export class ShrimpAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private usesThisTurn = 0;
  private readonly maxUsesPerTurn = 3;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ShrimpAbility',
      owner: owner,
      triggers: ['FriendSold', 'StartTurn'],
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
    const owner = this.owner;
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (this.usesThisTurn >= this.maxUsesPerTurn) {
      this.triggerTigerExecution(context);
      return;
    }

    const soldPet = context.triggerPet;
    if (!soldPet || !soldPet.isSellPet()) {
      this.triggerTigerExecution(context);
      return;
    }

    const targetResp = owner.parent.getRandomPet([owner]);
    const target = targetResp.pet;
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    const healthGain = this.level;
    target.increaseHealth(healthGain);
    this.usesThisTurn++;

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${healthGain} health after ${soldPet.name} was sold.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetResp.random,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ShrimpAbility {
    return new ShrimpAbility(newOwner, this.logService, this.abilityService);
  }
}
