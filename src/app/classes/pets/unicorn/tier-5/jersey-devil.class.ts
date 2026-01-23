import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { logAbility, resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class JerseyDevil extends Pet {
  name = 'Jersey Devil';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 5;
  health = 4;
  initAbilities(): void {
    this.addAbility(new JerseyDevilAbility(this, this.logService));
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


export class JerseyDevilAbility extends Ability {
  private logService: LogService;
  private pendingBuffs: Map<Pet, { attack: number; health: number }> =
    new Map();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'JerseyDevilAbility',
      owner: owner,
      triggers: ['FriendSummoned', 'EndTurn'],
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

    if (context.trigger === 'EndTurn') {
      this.resetBuffs();
      this.triggerTigerExecution(context);
      return;
    }

    if (!triggerPet) {
      return;
    }

    const isPlayer = owner.parent === gameApi.player;
    let mult = isPlayer ? gameApi.playerLevel3Sold : gameApi.opponentLevel3Sold;
    mult = Math.min(mult ?? 0, 5);
    const power = this.level * mult;

    const targetResp = resolveFriendSummonedTarget(
      owner,
      triggerPet,
      (o, pet) => o.parent.getSpecificPet(o, pet),
    );
    if (!targetResp.pet || power <= 0) {
      return;
    }

    const target = targetResp.pet;
    target.increaseAttack(power);
    target.increaseHealth(power);
    const existing = this.pendingBuffs.get(target) ?? { attack: 0, health: 0 };
    this.pendingBuffs.set(target, {
      attack: existing.attack + power,
      health: existing.health + power,
    });

    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} ${power} attack and ${power} health until next turn.`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  private resetBuffs(): void {
    for (const [pet, amounts] of this.pendingBuffs) {
      if (!pet) {
        continue;
      }
      if (amounts.attack) {
        pet.increaseAttack(-amounts.attack);
      }
      if (amounts.health) {
        pet.increaseHealth(-amounts.health);
      }
    }
    this.pendingBuffs.clear();
  }

  copy(newOwner: Pet): JerseyDevilAbility {
    return new JerseyDevilAbility(newOwner, this.logService);
  }
}

