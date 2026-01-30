import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Hamster extends Pet {
  name = 'Hamster';
  tier = 5;
  pack: Pack = 'Star';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new HamsterAbility(this, this.logService, this.abilityService),
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


export class HamsterAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private usesThisTurn = 0;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'HamsterAbility',
      owner: owner,
      triggers: ['Roll', 'StartTurn'],
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
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    const maxUses = this.level * 2;
    if (this.usesThisTurn >= maxUses) {
      this.triggerTigerExecution(context);
      return;
    }

    this.usesThisTurn++;
    const owner = this.owner;
    this.logService.createLog({
      message: `${owner.name} gained a free roll.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HamsterAbility {
    return new HamsterAbility(newOwner, this.logService, this.abilityService);
  }
}
