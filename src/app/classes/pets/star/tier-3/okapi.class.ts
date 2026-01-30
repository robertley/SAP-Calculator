import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Okapi extends Pet {
  name = 'Okapi';
  tier = 3;
  pack: Pack = 'Star';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new OkapiAbility(this, this.logService, this.abilityService));
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


export class OkapiAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private usesThisTurn = 0;
  private pendingAttack = 0;
  private pendingHealth = 0;
  private readonly maxUsesPerTurn = 5;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'OkapiAbility',
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
    const owner = this.owner;
    if (context.trigger === 'StartTurn') {
      if (this.pendingAttack || this.pendingHealth) {
        owner.increaseAttack(-this.pendingAttack);
        owner.increaseHealth(-this.pendingHealth);
      }
      this.pendingAttack = 0;
      this.pendingHealth = 0;
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (this.usesThisTurn >= this.maxUsesPerTurn) {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level;
    owner.increaseAttack(buff);
    owner.increaseHealth(buff);
    this.pendingAttack += buff;
    this.pendingHealth += buff;
    this.usesThisTurn++;

    this.logService.createLog({
      message: `${owner.name} gained +${buff}/+${buff} until next turn.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OkapiAbility {
    return new OkapiAbility(newOwner, this.logService, this.abilityService);
  }
}
