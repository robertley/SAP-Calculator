import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Leech extends Pet {
  name = 'Leech';
  tier = 3;
  pack: Pack = 'Star';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new LeechAbility(this, this.logService, this.abilityService));
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


export class LeechAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'LeechAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const target = owner.petAhead;
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    const damage = this.level;
    const actualDamage = Math.min(damage, target.health);
    owner.dealDamage(target, damage);
    owner.increaseHealth(actualDamage);

    this.logService.createLog({
      message: `${owner.name} dealt ${damage} damage to ${target.name} and gained ${actualDamage} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LeechAbility {
    return new LeechAbility(newOwner, this.logService, this.abilityService);
  }
}
