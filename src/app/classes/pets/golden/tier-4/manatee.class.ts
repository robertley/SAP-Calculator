import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Manatee extends Pet {
  name = 'Manatee';
  tier = 4;
  pack: Pack = 'Golden';
  attack = 2;
  health = 11;
  initAbilities(): void {
    this.addAbility(
      new ManateeAbility(this, this.logService, this.abilityService),
    );
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


export class ManateeAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ManateeAbility',
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
    const attackGain = this.level * 2;
    const healthGain = this.level;

    owner.dealDamage(owner, 5);
    if (target) {
      target.increaseAttack(attackGain);
      target.increaseHealth(healthGain);
      this.logService.createLog({
        message: `${owner.name} took 5 damage and gave ${target.name} +${attackGain}/+${healthGain}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
    } else {
      this.logService.createLog({
        message: `${owner.name} took 5 damage.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ManateeAbility {
    return new ManateeAbility(newOwner, this.logService, this.abilityService);
  }
}
