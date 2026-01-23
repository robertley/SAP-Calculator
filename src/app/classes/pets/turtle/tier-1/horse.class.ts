import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { logAbility, resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class Horse extends Pet {
  name = 'Horse';
  tier = 1;
  pack: Pack = 'Turtle';
  health = 1;
  attack = 2;
  initAbilities() {
    this.addAbility(new HorseAbility(this, this.logService));
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


export class HorseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HorseAbility',
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Use ability level - Tiger system will override this.level during second execution
    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    target.increaseAttack(this.level);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} ${this.level} attack`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HorseAbility {
    return new HorseAbility(newOwner, this.logService);
  }
}

