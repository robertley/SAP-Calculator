import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { resolveTriggerTargetAlive } from 'app/classes/ability-helpers';


export class Cyclops extends Pet {
  name = 'Cyclops';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 5;
  initAbilities(): void {
    this.addAbility(new CyclopsAbility(this, this.logService));
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


export class CyclopsAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CyclopsAbility',
      owner: owner,
      triggers: ['FriendLeveledUp'],
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

    let manaGain = this.level * 2;
    let manaTargetResp = resolveTriggerTargetAlive(owner, triggerPet);
    let manaTarget = manaTargetResp.pet;
    if (manaTarget == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${manaTarget.name} ${manaGain} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: manaTargetResp.random,
    });
    manaTarget.increaseMana(manaGain);

    if (this.currentUses < this.level) {
      let expTargetResp = resolveTriggerTargetAlive(owner, triggerPet);
      let expTarget = expTargetResp.pet;
      if (expTarget == null) {
        return;
      }
      this.logService.createLog({
        message: `${owner.name} gave ${expTarget.name} 1 exp.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: expTargetResp.random,
      });

      expTarget.increaseExp(1);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CyclopsAbility {
    return new CyclopsAbility(newOwner, this.logService);
  }
}
