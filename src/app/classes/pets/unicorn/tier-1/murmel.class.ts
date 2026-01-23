import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Murmel extends Pet {
  name = 'Murmel';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 1;
  health = 4;
  initAbilities(): void {
    this.addAbility(new MurmelAbility(this, this.logService));
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


export class MurmelAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MurmelAbility',
      owner: owner,
      triggers: ['FriendGainedExp'],
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

    let power = this.level;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    target.increaseAttack(power);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MurmelAbility {
    return new MurmelAbility(newOwner, this.logService);
  }
}
