import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Mimic extends Pet {
  name = 'Mimic';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 3;
  health = 6;
  initAbilities(): void {
    this.addAbility(
      new MimicAbility(this, this.logService, this.abilityService),
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


export class MimicAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Mimic Ability',
      owner: owner,
      triggers: ['StartBattle', 'FriendDied'],
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
    const ownerData = owner as {
      mimicFaintCount?: number;
      mimicTriggeredThreshold?: number;
    };

    if (context.trigger === 'StartBattle') {
      ownerData.mimicFaintCount = 0;
      ownerData.mimicTriggeredThreshold = 0;
      (owner.parent as any)['pendingGoldFromMimic'] = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (context.trigger === 'FriendDied') {
      ownerData.mimicFaintCount = (ownerData.mimicFaintCount ?? 0) + 1;
      const triggeredThreshold = Math.floor(
        (ownerData.mimicFaintCount ?? 0) / 3,
      );
      const priorThreshold = ownerData.mimicTriggeredThreshold ?? 0;

      if (triggeredThreshold > priorThreshold) {
        const activations = triggeredThreshold - priorThreshold;
        ownerData.mimicTriggeredThreshold = triggeredThreshold;
        const goldPerActivation = this.level;
        const totalGold = goldPerActivation * activations;
        const key = 'pendingGoldFromMimic';
        (owner.parent as any)[key] =
          ((owner.parent as any)[key] ?? 0) + totalGold;

        this.logService.createLog({
          message: `${owner.name} will grant +${totalGold} gold next turn after ${ownerData.mimicFaintCount} friendly faints.`,
          type: 'ability',
          player: owner.parent,
        });
      }
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MimicAbility {
    return new MimicAbility(newOwner, this.logService, this.abilityService);
  }
}
