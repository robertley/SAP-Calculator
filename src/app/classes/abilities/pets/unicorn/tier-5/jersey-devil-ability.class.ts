import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import {
  logAbility,
  resolveFriendSummonedTarget,
} from '../../../ability-helpers';

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
