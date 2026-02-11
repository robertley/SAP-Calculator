import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getAliveTriggerTarget } from 'app/domain/entities/ability-resolution';


export class VampireBat extends Pet {
  name = 'Vampire Bat';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 5;

  initAbilities(): void {
    this.addAbility(new VampireBatAbility(this, this.logService));
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


export class VampireBatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VampireBatAbility',
      owner: owner,
      triggers: ['EnemyGainedAilment'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      precondition: (context: AbilityContext) => {
        const { triggerPet } = context;
        const owner = this.owner;
        const targetResp = getAliveTriggerTarget(owner, triggerPet);
        const target = targetResp.pet;
        return !!target && target.alive;
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

    let power = this.level * 4;
    let snipeTargetResp = getAliveTriggerTarget(owner, triggerPet);
    let snipeTarget = snipeTargetResp.pet;
    if (snipeTarget == null) {
      return;
    }

    const targetHealthBeforeSnipe = snipeTarget.health;
    let damage = owner.snipePet(snipeTarget, power, false, tiger);
    let healthGained = Math.min(damage, targetHealthBeforeSnipe);

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${healthGained} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });
    target.increaseHealth(healthGained);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VampireBatAbility {
    return new VampireBatAbility(newOwner, this.logService);
  }
}




