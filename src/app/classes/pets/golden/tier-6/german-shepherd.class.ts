import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { logAbility, resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class GermanShepherd extends Pet {
  name = 'German Shepherd';
  tier = 6;
  pack: Pack = 'Golden';
  attack = 10;
  health = 6;
  initAbilities(): void {
    this.addAbility(new GermanShepherdAbility(this, this.logService));
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


export class GermanShepherdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GermanShepherdAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
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
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const percent = this.level * 0.25;
    const power = Math.floor(owner.attack * percent);
    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    target.increaseAttack(power);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} ${power} attack.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GermanShepherdAbility {
    return new GermanShepherdAbility(newOwner, this.logService);
  }
}

