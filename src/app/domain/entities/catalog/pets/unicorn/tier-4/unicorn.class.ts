import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { resolveTriggerTargetAlive } from 'app/domain/entities/ability-resolution';


export class Unicorn extends Pet {
  name = 'Unicorn';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 4;

  initAbilities(): void {
    this.addAbility(new UnicornAbility(this, this.logService));
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


export class UnicornAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'UnicornAbility',
      owner: owner,
      triggers: ['FriendGainsAilment'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      precondition: (context: AbilityContext) => {
        const { triggerPet } = context;
        const owner = this.owner;
        const targetResp = resolveTriggerTargetAlive(owner, triggerPet);
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
    let power = this.level * 2;
    if (!triggerPet) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} removed ailment from ${triggerPet.name}.`,
      type: 'ability',
      player: owner.parent,
    });
    triggerPet.removePerk();

    let targetResp = resolveTriggerTargetAlive(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
      type: 'ability',
      player: owner.parent,
      randomEvent: targetResp.random,
    });

    target.increaseAttack(power);
    target.increaseHealth(power);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): UnicornAbility {
    return new UnicornAbility(newOwner, this.logService);
  }
}



