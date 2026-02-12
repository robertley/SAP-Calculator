import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Lioness extends Pet {
  name = 'Lioness';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new LionessAbility(this, this.logService));
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


export class LionessAbility extends Ability {
  private logService: LogService;
  private usesThisTurn: number = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LionessAbility',
      owner: owner,
      triggers: ['StartTurn', 'FriendSold'],
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
    const owner = this.owner;
    const { trigger, triggerPet, tiger, pteranodon } = context;

    if (trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (trigger !== 'FriendSold') {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.usesThisTurn >= 2) {
      this.triggerTigerExecution(context);
      return;
    }

    this.usesThisTurn++;
    const tier = triggerPet?.tier ?? owner.tier;
    const futureShopBuffs: Map<number, { attack: number; health: number }> =
      owner.parent.futureShopBuffs ?? new Map();

    const buff = futureShopBuffs.get(tier) ?? { attack: 0, health: 0 };
    buff.attack += this.level;
    buff.health += this.level;
    futureShopBuffs.set(tier, buff);
    owner.parent.futureShopBuffs = futureShopBuffs;

    this.logService.createLog({
      message: `${owner.name} gave future tier ${tier} shop pets +${this.level}/+${this.level} (uses ${this.usesThisTurn}/2 this turn).`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LionessAbility {
    return new LionessAbility(newOwner, this.logService);
  }
}


