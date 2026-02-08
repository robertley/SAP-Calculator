import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { resolveTriggerTargetAlive } from 'app/classes/ability-helpers';


export class IliPika extends Pet {
  name = 'Ili Pika';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new IliPikaAbility(this, this.logService));
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


export class IliPikaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'IliPikaAbility',
      owner: owner,
      triggers: ['FriendTransformed'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
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

    let targetResp = resolveTriggerTargetAlive(owner, triggerPet);
    let target = targetResp.pet;

    if (!target) {
      return;
    }

    let power = this.level * 1;

    // Determine highest stat
    if (target.attack > target.health) {
      target.increaseAttack(power);
      this.logService.createLog({
        message: `${owner.name} give ${power} attack to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    } else {
      target.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} give ${power} health to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): IliPikaAbility {
    return new IliPikaAbility(newOwner, this.logService);
  }
}
