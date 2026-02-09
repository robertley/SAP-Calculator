import { Power } from 'app/domain/interfaces/power.interface';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { logAbility, resolveFriendSummonedTarget } from 'app/domain/entities/ability-resolution';


export class Turkey extends Pet {
  name = 'Turkey';
  tier = 5;
  pack: Pack = 'Turtle';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new TurkeyAbility(this, this.logService));
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


export class TurkeyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TurkeyAbility',
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

    const power: Power = {
      attack: 3 * this.level,
      health: 1 * this.level,
    };

    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (!targetResp.pet) {
      return;
    }

    const target = targetResp.pet;
    target.increaseAttack(power.attack);
    target.increaseHealth(power.health);
    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TurkeyAbility {
    return new TurkeyAbility(newOwner, this.logService);
  }
}




