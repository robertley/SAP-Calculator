import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Power } from 'app/interfaces/power.interface';


export class LovelandFrogman extends Pet {
  name = 'Loveland Frogman';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 1;
  health = 5;

  initAbilities(): void {
    this.addAbility(new LovelandFrogmanAbility(this, this.logService));
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


export class LovelandFrogmanAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LovelandFrogmanAbility',
      owner: owner,
      triggers: ['BeforeFriendAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    let power: Power = {
      attack: owner.level * 1,
      health: owner.level * 2,
    };
    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
      type: 'ability',
      player: owner.parent,
      randomEvent: targetResp.random,
    });

    target.increaseAttack(power.attack);
    target.increaseHealth(power.health);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LovelandFrogmanAbility {
    return new LovelandFrogmanAbility(newOwner, this.logService);
  }
}
