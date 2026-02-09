import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { awardExperienceWithLog } from 'app/domain/entities/ability-effects';
import { resolveFriendSummonedTarget } from 'app/domain/entities/ability-resolution';


export class Alpaca extends Pet {
  name = 'Alpaca';
  tier = 6;
  pack: Pack = 'Star';
  attack = 3;
  health = 7;

  initAbilities(): void {
    this.addAbility(new AlpacaAbility(this, this.logService));
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


export class AlpacaAbility extends Ability {
  private logService: LogService;
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AlpacaAbility',
      owner: owner,
      triggers: ['FriendSummoned'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return triggerPet && !(triggerPet instanceof Alpaca);
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    awardExperienceWithLog({
      logService: this.logService,
      owner,
      context,
      target: targetResp.pet,
      amount: 3,
      extras: { randomEvent: targetResp.random },
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AlpacaAbility {
    return new AlpacaAbility(newOwner, this.logService);
  }
}




