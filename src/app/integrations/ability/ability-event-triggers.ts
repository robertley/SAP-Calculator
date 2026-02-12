import { Player } from 'app/domain/entities/player.class';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { GameService } from 'app/runtime/state/game.service';
import { Pet } from 'app/domain/entities/pet.class';
import { ToyEventService } from './toy-event.service';
import { AbilityQueueService } from './ability-queue.service';
import { FaintEventService } from './faint-event.service';
import {
  triggerAilmentGainEvents,
  triggerFoodEvents,
  triggerPerkGainEvents,
  triggerPerkLossEvents,
} from './ability-status-triggers';

export abstract class AbilityEventTriggers {
  protected abstract gameService: GameService;
  protected abstract toyEventService: ToyEventService;
  protected abstract abilityQueueService: AbilityQueueService;
  protected abstract faintEventService: FaintEventService;
  protected abstract logTriggerHeader(event: AbilityEvent): void;
  protected abstract clearLastLoggedTrigger(): void;

  // Summon events
  triggerSummonEvents(summonedPet: Pet) {
    const parent = summonedPet?.parent;
    if (!parent || !Array.isArray(parent.petArray)) {
      return;
    }

    // Trigger toy events for friend summons
    this.triggerFriendSummonedToyEvents(parent, summonedPet);

    // Check friends (if this is a friend summon)
    for (let pet of this.abilityQueueService.getTeam(parent)) {
      if (pet == summonedPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'ThisSummoned',
          summonedPet,
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendSummoned',
          summonedPet,
        );
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          summonedPet,
          undefined,
          this.abilityQueueService.getNumberedTriggersForPet(
            pet,
            'FriendSummoned',
          ),
        );
        // Special summon types
        if (summonedPet.name === 'Bee') {
          this.abilityQueueService.triggerAbility(
            pet,
            'BeeSummoned',
            summonedPet,
          );
        }
      }
    }

    // Check enemies (if this is an enemy summon)
    const enemyPets =
      parent.opponent && Array.isArray(parent.opponent.petArray)
        ? parent.opponent.petArray
        : [];
    enemyPets.forEach((pet: Pet) =>
      this.abilityQueueService.triggerAbility(
        pet,
        'EnemySummoned',
        summonedPet,
      ),
    );

    this.executeFriendSummonedToyEvents();
  }

  // Faint Events
  triggerFaintEvents(faintedPet: Pet) {
    this.faintEventService.triggerFaintEvents(faintedPet);
  }

  triggerAfterFaintEvents(faintedPet: Pet) {
    this.faintEventService.triggerAfterFaintEvents(faintedPet);
  }

  // Food events handler
  triggerFoodEvents(eatingPet: Pet, foodType?: string) {
    triggerFoodEvents(this.abilityQueueService, eatingPet, foodType);
  }

  // Perk gain events handler
  triggerPerkGainEvents(perkPet: Pet, perkType?: string) {
    triggerPerkGainEvents(this.abilityQueueService, perkPet, perkType);
  }

  // Perk loss events handler
  triggerPerkLossEvents(perkPet: Pet, perkType?: string) {
    triggerPerkLossEvents(this.abilityQueueService, perkPet, perkType);
  }

  // Ailment events handler
  triggerAilmentGainEvents(ailmentPet: Pet, ailmentType?: string) {
    triggerAilmentGainEvents(this.abilityQueueService, ailmentPet, ailmentType);
  }

  // Transform events handler
  triggerTransformEvents(originalPet: Pet) {
    const transformedPet = originalPet.transformedInto;
    if (!transformedPet) {
      return;
    }
    // Check friends
    for (let pet of this.abilityQueueService.getTeam(transformedPet)) {
      if (pet == transformedPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'ThisTransformed',
          transformedPet,
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendTransformed',
          transformedPet,
        );
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          transformedPet,
          undefined,
          this.abilityQueueService.getNumberedTriggersForPet(
            pet,
            'FriendTransformed',
          ),
        );
      }
    }
  }

  // Fling events handler (Movement)
  triggerFlungEvents(movedPet: Pet) {
    // Handle friend fling events
    for (let pet of this.abilityQueueService.getTeam(movedPet)) {
      this.abilityQueueService.triggerAbility(pet, 'AnyoneFlung', movedPet);
      if (pet != movedPet) {
        this.abilityQueueService.triggerAbility(pet, 'FriendFlung', movedPet);
      }
    }

    for (let pet of this.abilityQueueService.getTeam(
      movedPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(pet, 'AnyoneFlung', movedPet);
    }
  }

  triggerPushedEvents(pushedPet: Pet) {
    for (let pet of this.abilityQueueService.getTeam(
      pushedPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(pet, 'EnemyPushed', pushedPet);
    }
  }

  // Kill events handler
  triggerKillEvents(killerPet: Pet, killedPet: Pet) {
    // Check if killed pet was an enemy
    if (killedPet.parent !== killerPet.parent) {
      this.abilityQueueService.triggerAbility(
        killerPet,
        'KnockOut',
        killedPet,
      );
    }
  }

  triggerHurtEvents(hurtedPet: Pet, damageAmount?: number): void {
    const customParams =
      damageAmount !== undefined ? { damageAmount } : undefined;

    // check friends
    for (let pet of this.abilityQueueService.getTeam(hurtedPet)) {
      this.abilityQueueService.triggerAbility(
        pet,
        'AnyoneHurt',
        hurtedPet,
        customParams,
      );
      if (pet == hurtedPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'ThisHurt',
          hurtedPet,
          customParams,
        );
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          hurtedPet,
          customParams,
          this.abilityQueueService.getNumberedTriggersForPet(pet, 'ThisHurt'),
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendHurt',
          hurtedPet,
          customParams,
        );
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          hurtedPet,
          customParams,
          this.abilityQueueService.getNumberedTriggersForPet(pet, 'FriendHurt'),
        );
      }
      if (pet == hurtedPet.petBehind(undefined, true)) {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendAheadHurt',
          hurtedPet,
          customParams,
        );
      }
      if (pet == pet.petBehind() || pet.petAhead) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AdjacentFriendsHurt',
          hurtedPet,
          customParams,
        );
      }
      if (pet.position < hurtedPet.position) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AnyoneBehindHurt',
          hurtedPet,
          customParams,
        );
      }
    }
    // check Enemies
    for (let pet of this.abilityQueueService.getTeam(
      hurtedPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(
        pet,
        'EnemyHurt',
        hurtedPet,
        customParams,
      );
      this.abilityQueueService.triggerAbility(
        pet,
        'AnyoneHurt',
        hurtedPet,
        customParams,
      );
      this.abilityQueueService.handleNumberedCounterTriggers(
        pet,
        hurtedPet,
        customParams,
        this.abilityQueueService.getNumberedTriggersForPet(pet, 'EnemyHurt'),
      );
    }
  }

  // Level up events handler
  triggerLevelUpEvents(levelUpPet: Pet) {
    const player = levelUpPet.parent;
    this.triggerFriendlyLevelUpToyEvents(player, levelUpPet);

    // Check friends
    for (let pet of player.petArray) {
      this.abilityQueueService.triggerAbility(pet, 'AnyLeveledUp', levelUpPet);
      this.abilityQueueService.triggerAbility(
        pet,
        'FriendlyLeveledUp',
        levelUpPet,
      );
      if (pet == levelUpPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'ThisLeveledUp',
          levelUpPet,
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendLeveledUp',
          levelUpPet,
        );
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          levelUpPet,
          undefined,
          this.abilityQueueService.getNumberedTriggersForPet(
            pet,
            'FriendlyLeveledUp',
          ),
        );
      }
    }

    // Check enemies
    if (player.opponent && Array.isArray(player.opponent.petArray)) {
      for (let pet of player.opponent.petArray) {
        this.abilityQueueService.triggerAbility(
          pet,
          'AnyLeveledUp',
          levelUpPet,
        );
      }
    }
  }

  triggerEmptyFrontSpaceEvents(player: Player) {
    for (let pet of player.petArray) {
      if (pet.clearFrontTriggered) {
        continue;
      }
      this.abilityQueueService.triggerAbility(pet, 'EmptyFrontSpace');
      pet.clearFrontTriggered = true;
    }
  }

  executeEmptyFrontSpaceEvents(): void {
    this.abilityQueueService.processQueue(this.gameService.gameApi, {
      filter: (event) => event.abilityType === 'EmptyFrontSpace',
      onExecute: (event) => this.logTriggerHeader(event),
    });
    this.clearLastLoggedTrigger();
  }

  triggerToyBrokeEvents(player: Player) {
    for (let pet of player.petArray) {
      this.abilityQueueService.triggerAbility(pet, 'FriendlyToyBroke');
    }
  }

  // Jump events handler
  triggerJumpEvents(jumpPet: Pet) {
    this.triggerFriendJumpedToyEvents(jumpPet.parent, jumpPet);

    // Check friends
    for (let pet of this.abilityQueueService.getTeam(jumpPet)) {
      this.abilityQueueService.triggerAbility(pet, 'AnyoneJumped', jumpPet);
      if (pet == jumpPet) {
        // No action
      } else {
        this.abilityQueueService.triggerAbility(pet, 'FriendJumped', jumpPet);
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          jumpPet,
          undefined,
          this.abilityQueueService.getNumberedTriggersForPet(
            pet,
            'FriendJumped',
          ),
        );
      }
    }

    // Check enemies
    for (let pet of this.abilityQueueService.getTeam(
      jumpPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(pet, 'AnyoneJumped', jumpPet);
    }

    this.executeFriendJumpedToyEvents();
  }

  // Mana events handler
  triggerManaGainedEvents(manaPet: Pet) {
    this.abilityQueueService.triggerAbility(manaPet, 'ThisGainedMana', manaPet);
  }

  setManaEvent(event: AbilityEvent) {
    event.abilityType = 'ManaSnipe';
    this.abilityQueueService.addEventToQueue(event);
  }

  setgoldenRetrieverSummonsEvent(event: AbilityEvent) {
    event.abilityType = 'GoldenRetrieverSummons';
    this.abilityQueueService.addEventToQueue(event);
  }

  triggerFriendGainsHealthEvents(healthPet: Pet) {
    // Placeholder
  }

  // Experience Events handler
  triggerFriendGainedExperienceEvents(ExpPet: Pet) {
    for (let pet of this.abilityQueueService.getTeam(ExpPet)) {
      this.abilityQueueService.triggerAbility(pet, 'FriendlyGainedExp', ExpPet);
      if (pet === ExpPet) {
        continue;
      } else {
        this.abilityQueueService.triggerAbility(pet, 'FriendGainedExp', ExpPet);
      }
    }
  }

  // --- Toy Event Delegations ---

  triggerEmptyFrontSpaceToyEvents(player: Player): void {
    this.toyEventService.triggerEmptyFrontSpaceToyEvents(player);
  }

  executeEmptyFrontSpaceToyEvents(): void {
    this.toyEventService.executeEmptyFrontSpaceToyEvents();
  }

  triggerFriendSummonedToyEvents(player: Player, pet: Pet): void {
    this.toyEventService.triggerFriendSummonedToyEvents(player, pet);
  }

  executeFriendSummonedToyEvents(): void {
    this.toyEventService.executeFriendSummonedToyEvents();
  }

  triggerFriendlyLevelUpToyEvents(player: Player, pet: Pet): void {
    this.toyEventService.triggerFriendlyLevelUpToyEvents(player, pet);
  }

  executeFriendlyLevelUpToyEvents(): void {
    this.toyEventService.executeFriendlyLevelUpToyEvents();
  }

  triggerFriendFaintsToyEvents(player: Player, pet: Pet): void {
    this.toyEventService.triggerFriendFaintsToyEvents(player, pet);
  }

  executeFriendFaintsToyEvents(): void {
    this.toyEventService.executeFriendFaintsToyEvents();
  }

  triggerFriendJumpedToyEvents(player: Player, pet: Pet): void {
    this.toyEventService.triggerFriendJumpedToyEvents(player, pet);
  }

  executeFriendJumpedToyEvents(): void {
    this.toyEventService.executeFriendJumpedToyEvents();
  }

}
