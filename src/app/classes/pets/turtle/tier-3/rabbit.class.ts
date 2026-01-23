import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Rabbit extends Pet {
  name = 'Rabbit';
  tier = 3;
  pack: Pack = 'Turtle';
  health = 2;
  attack = 1;

  initAbilities(): void {
    this.addAbility(new RabbitAbility(this, this.logService));
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


export class RabbitAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RabbitAbility',
      owner: owner,
      triggers: ['FoodEatenByFriendly'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level;
    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RabbitAbility {
    return new RabbitAbility(newOwner, this.logService);
  }
}
