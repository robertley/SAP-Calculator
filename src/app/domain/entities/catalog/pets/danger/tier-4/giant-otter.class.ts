import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Power } from 'app/domain/interfaces/power.interface';


export class GiantOtter extends Pet {
  name = 'Giant Otter';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 4;
  health = 3;

  // Track total temporary buffs applied per friend
  private buffedFriends: Map<Pet, { attack: number; health: number }> =
    new Map();
  initAbilities(): void {
    this.addAbility(new GiantOtterAbility(this, this.logService));
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


// Before battle: Give friends +2 attack and +5 health until after the first non-jump attack.
export class GiantOtterAbility extends Ability {
  private logService: LogService;
  private buffedFriends: Map<Pet, { attack: number; health: number }> =
    new Map();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GiantOtterAbility',
      owner: owner,
      triggers: ['BeforeStartBattle', 'AnyoneAttack', 'PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  reset(): void {
    this.buffedFriends.clear();
    super.reset();
  }

  removeConditionalBuffs(): void {
    if (this.buffedFriends.size > 0) {
      this.logService.createLog({
        message: `${this.owner.name} removed its temporary buffs after the first non-jump attack`,
        type: 'ability',
        player: this.owner.parent,
      });
    }
    for (let [originalFriend, stats] of this.buffedFriends) {
      let currentFriend = originalFriend;
      if (currentFriend.transformed && currentFriend.transformedInto) {
        currentFriend = currentFriend.transformedInto;
      }
      if (currentFriend && currentFriend.alive) {
        if (stats.attack > 0) {
          currentFriend.increaseAttack(-stats.attack);
        }
        if (stats.health > 0) {
          currentFriend.increaseHealth(-stats.health);
        }
        if (stats.attack > 0 || stats.health > 0) {
          const parts: string[] = [];
          if (stats.attack > 0) {
            parts.push(`${stats.attack} attack`);
          }
          if (stats.health > 0) {
            parts.push(`${stats.health} health`);
          }
          this.logService.createLog({
            message: `${currentFriend.name} lost ${parts.join(' and ')} (Giant Otter Buffs removed)`,
            type: 'ability',
            player: this.owner.parent,
          });
        }
      }
      // Always delete using the original key
      this.buffedFriends.delete(originalFriend);
    }
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const trigger = context.trigger as string | undefined;
    const owner = this.owner;

    if (trigger === 'PostRemovalFaint') {
      this.removeConditionalBuffs();
      return;
    }

    // Inferred Trigger: AnyoneAttack
    // We know triggers are limited to 'BeforeStartBattle' and 'AnyoneAttack'.
    // We ensure 'AnyoneAttack' passes triggerPet (via AbilityService). 'BeforeStartBattle' does not.
    if (triggerPet) {
      // Remove buffs if it's NOT a jump attack
      if (gameApi.FirstNonJumpAttackHappened) {
        this.removeConditionalBuffs();
      }
      return;
    }

    // Inferred Trigger: BeforeStartBattle
    // Proceed to apply buffs logic below.

    let statBonus: Power = {
      attack: this.level * 2,
      health: this.level * 5,
    }; // 2/4/6 Attack, 5/10/15 Health

    let targetResp = owner.parent.getAll(false, owner, true);
    let friends = targetResp.pets;

    for (let friend of friends) {
      const existing = this.buffedFriends.get(friend);
      if (existing) {
        existing.attack += statBonus.attack;
        existing.health += statBonus.health;
      } else {
        this.buffedFriends.set(friend, {
          attack: statBonus.attack,
          health: statBonus.health,
        });
      }

      friend.increaseAttack(statBonus.attack);
      friend.increaseHealth(statBonus.health);

      this.logService.createLog({
        message: `${owner.name} gave ${friend.name} +${statBonus.attack} attack and +${statBonus.health} health`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GiantOtterAbility {
    return new GiantOtterAbility(newOwner, this.logService);
  }
}



