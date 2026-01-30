import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Hippo extends Pet {
  name = 'Hippo';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 4;
  health = 6;
  initAbilities(): void {
    this.addAbility(new HippoAbility(this, this.logService));
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


export class HippoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HippoAbility',
      owner: owner,
      triggers: ['KnockOut'],
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
    let power = 3 * this.level;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.increaseAttack(power);
    target.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HippoAbility {
    return new HippoAbility(newOwner, this.logService);
  }
}
