import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class PhilippineEagle extends Pet {
  name = 'Philippine Eagle';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 7;
  health = 6;

  initAbilities(): void {
    this.addAbility(new PhilippineEagleAbility(this, this.logService));
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


export class PhilippineEagleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PhilippineEagleAbility',
      owner: owner,
      triggers: ['AnyoneJumped'],
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

    let targetResp = owner.parent.getRandomPet([], false, false, false, owner);
    let target = targetResp.pet;
    if (!target) {
      return;
    }

    let buffAmount = this.level * 4;

    target.increaseAttack(buffAmount);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buffAmount} attack`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    target.increaseHealth(buffAmount);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buffAmount} health`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PhilippineEagleAbility {
    return new PhilippineEagleAbility(newOwner, this.logService);
  }
}
