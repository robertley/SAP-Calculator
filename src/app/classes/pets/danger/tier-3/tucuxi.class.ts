import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Tucuxi extends Pet {
  name = 'Tucuxi';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 2;
  health = 3;

  initAbilities(): void {
    this.addAbility(new TucuxiAbility(this, this.logService));
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


export class TucuxiAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TucuxiAbility',
      owner: owner,
      triggers: ['Faint'],
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

    // Get target for push effect
    let pushTargetResp = owner.parent.getLastPet([owner], owner);
    let pushTarget = pushTargetResp.pet;

    // Safety check for push target
    if (!pushTarget) {
      return;
    }

    // Push target to front (this will handle occupied front slot automatically)
    owner.parent.pushPetToFront(pushTarget, false);

    this.logService.createLog({
      message: `${owner.name} pushed ${pushTarget.name} to the front`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: pushTargetResp.random,
    });

    // Give level-based buffs (3/6/9 attack and health) to the pushed pet
    let power = this.level * 3;
    pushTarget.increaseAttack(power);
    pushTarget.increaseHealth(power);

    this.logService.createLog({
      message: `${owner.name} gave ${pushTarget.name} +${power} attack and +${power} health`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: pushTargetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TucuxiAbility {
    return new TucuxiAbility(newOwner, this.logService);
  }
}

