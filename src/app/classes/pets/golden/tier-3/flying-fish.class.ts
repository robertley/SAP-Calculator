import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { awardExperienceWithLog } from 'app/classes/ability-effects';
import { resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class FlyingFish extends Pet {
  name = 'Flying Fish';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 5;
  health = 2;
  initAbilities(): void {
    this.addAbility(new FlyingFishAbility(this, this.logService));
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


export class FlyingFishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FlyingFishAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const power = this.level * 2;
    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    awardExperienceWithLog({
      logService: this.logService,
      owner,
      context,
      target: targetResp.pet,
      amount: power,
      extras: { randomEvent: targetResp.random },
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FlyingFishAbility {
    return new FlyingFishAbility(newOwner, this.logService);
  }
}

