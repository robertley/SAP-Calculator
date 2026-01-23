import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class MalayTapir extends Pet {
  name = 'Malay Tapir';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new MalayTapirAbility(this, this.logService));
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


export class MalayTapirAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MalayTapirAbility',
      owner: owner,
      triggers: ['AdjacentFriendAttacked'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 3,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;

    if (!target) {
      return;
    }

    let healthGain = this.level * 1;
    target.increaseHealth(healthGain);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${healthGain} health`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MalayTapirAbility {
    return new MalayTapirAbility(newOwner, this.logService);
  }
}
