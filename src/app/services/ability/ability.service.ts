import { Injectable } from '@angular/core';
import { Player } from '../../classes/player.class';
import { GameAPI } from '../../interfaces/gameAPI.interface';
import { AbilityEvent } from '../../interfaces/ability-event.interface';
import { GameService } from '../game.service';
import { Pet } from '../../classes/pet.class';
import { LogService } from '../log.service';
import { AbilityTrigger } from '../../classes/ability.class';
import { ToyEventService } from './toy-event.service';
import { AbilityQueueService } from './ability-queue.service';
import { AttackEventService } from './attack-event.service';
import { FaintEventService } from './faint-event.service';

@Injectable({
  providedIn: 'root',
})
export class AbilityService {
  public gameApi!: GameAPI;
  private lastLoggedTrigger?: AbilityTrigger;

  constructor(
    private gameService: GameService,
    private logService: LogService,
    private toyEventService: ToyEventService,
    private abilityQueueService: AbilityQueueService,
    private attackEventService: AttackEventService,
    private faintEventService: FaintEventService,
  ) {}

  // --- Delegates to AbilityQueueService ---

  // Clear the global event queue
  clearGlobalEventQueue() {
    this.abilityQueueService.clearGlobalEventQueue();
    this.lastLoggedTrigger = undefined;
  }

  // Check if global queue has events
  get hasGlobalEvents(): boolean {
    return this.abilityQueueService.hasGlobalEvents;
  }

  get hasAbilityCycleEvents() {
    return this.abilityQueueService.hasGlobalEvents;
  }

  // Legacy API support for SimulationRunner
  getNextHighestPriorityEvent(): AbilityEvent | null {
    return this.abilityQueueService.getNextHighestPriorityEvent();
  }

  peekNextHighestPriorityEvent(): AbilityEvent | null {
    return this.abilityQueueService.peekNextHighestPriorityEvent();
  }

  getPriorityNumber(abilityType: string): number {
    return this.abilityQueueService.getPriorityNumber(abilityType);
  }

  executeEventCallback(event: AbilityEvent) {
    this.logTriggerHeader(event);
    this.abilityQueueService.executeEvent(event, this.gameService.gameApi);
    if (!this.hasGlobalEvents) {
      this.lastLoggedTrigger = undefined;
    }
  }

  private logTriggerHeader(event: AbilityEvent) {
    const trigger = event?.abilityType;
    if (!trigger) {
      return;
    }
    if (this.lastLoggedTrigger === trigger) {
      return;
    }
    this.lastLoggedTrigger = trigger;
    const player = event.player ?? event.pet?.parent;
    this.logService.createLog({
      message: `${trigger}:`,
      type: 'ability',
      player,
    });
  }

  simulateFriendDiedCounters(pet: Pet, count: number) {
    this.abilityQueueService.simulateFriendDiedCounters(pet, count);
  }

  // --- Event Triggering & Execution ---

  // End of Turn Events
  initSpecialEndTurnAbility(player: Player) {
    for (let pet of player.petArray) {
      if (pet.hasTrigger('SpecialEndTurn')) {
        pet.executeAbilities('SpecialEndTurn', this.gameService.gameApi);
      }
    }
  }

  // Before start of battle
  triggerBeforeStartOfBattleEvents() {
    this.gameApi = this.gameService.gameApi;

    for (let pet of this.gameApi.player.petArray) {
      if (pet.hasTrigger('BeforeStartBattle')) {
        this.abilityQueueService.triggerAbility(pet, 'BeforeStartBattle');
      }
    }
    for (let pet of this.gameApi.opponent.petArray) {
      if (pet.hasTrigger('BeforeStartBattle')) {
        this.abilityQueueService.triggerAbility(pet, 'BeforeStartBattle');
      }
    }
  }

  resetBeforeStartOfBattleEvents() {
    // No-op
  }

  executeBeforeStartOfBattleEvents() {
    this.abilityQueueService.processQueue(this.gameService.gameApi);
  }

  // Counter
  setCounterEvent(event: AbilityEvent) {
    this.abilityQueueService.addEventToQueue(event);
  }

  // Start Battle Events
  triggerStartBattleEvents(filter?: (pet: Pet) => boolean) {
    this.gameApi = this.gameService.gameApi;
    for (let pet of this.gameApi.player.petArray) {
      if (pet.hasTrigger('StartBattle') && (!filter || filter(pet))) {
        this.abilityQueueService.triggerAbility(pet, 'StartBattle');
      }
    }
    for (let pet of this.gameApi.opponent.petArray) {
      if (pet.hasTrigger('StartBattle') && (!filter || filter(pet))) {
        this.abilityQueueService.triggerAbility(pet, 'StartBattle');
      }
    }
  }

  executeStartBattleEvents() {
    this.abilityQueueService.processQueue(this.gameService.gameApi);
  }

  // Before Attack
  triggerBeforeAttackEvent(AttackingPet: Pet) {
    this.attackEventService.triggerBeforeAttackEvents(AttackingPet);
  }

  executeBeforeAttackEvents() {
    const beforeAttackTriggers = new Set([
      'BeforeFriendlyAttack',
      'BeforeThisAttacks',
      'BeforeFirstAttack',
      'BeforeFriendAttacks',
      'BeforeAdjacentFriendAttacked',
    ]);
    this.abilityQueueService.processQueue(this.gameService.gameApi, {
      filter: (event) => beforeAttackTriggers.has(event.abilityType as string),
      onExecute: (event) => this.logTriggerHeader(event),
    });
    this.lastLoggedTrigger = undefined;
  }

  // Friend/After attacks events
  triggerAttacksEvents(AttackingPet: Pet) {
    this.attackEventService.triggerAfterAttackEvents(AttackingPet);
  }

  executeAfterAttackEvents() {
    this.abilityQueueService.processQueue(this.gameService.gameApi);
  }

  // Summon events
  triggerSummonEvents(summonedPet: Pet) {
    const parent = summonedPet?.parent as any;
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
    // Check friends
    for (let pet of this.abilityQueueService.getTeam(eatingPet)) {
      this.abilityQueueService.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
      this.abilityQueueService.triggerAbility(
        pet,
        'FoodEatenByFriendly',
        eatingPet,
      );
      if (pet == eatingPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'FoodEatenByThis',
          eatingPet,
        );
        // Handle specific food types for this pet
        if (foodType === 'apple') {
          this.abilityQueueService.triggerAbility(
            pet,
            'AppleEatenByThis',
            eatingPet,
          );
          this.abilityQueueService.handleNumberedCounterTriggers(
            pet,
            eatingPet,
            undefined,
            this.abilityQueueService.getNumberedTriggersForPet(
              pet,
              'AppleEatenByThis',
            ),
          );
        } else if (foodType === 'corn') {
          this.abilityQueueService.triggerAbility(
            pet,
            'CornEatenByThis',
            eatingPet,
          );
        }
        this.abilityQueueService.handleNumberedCounterTriggers(
          pet,
          eatingPet,
          undefined,
          this.abilityQueueService.getNumberedTriggersForPet(pet, 'Eat'),
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FoodEatenByFriend',
          eatingPet,
        );
        // Specific food types for friends
        if (foodType === 'corn') {
          this.abilityQueueService.triggerAbility(
            pet,
            'CornEatenByFriend',
            eatingPet,
          );
        }
      }
    }

    // Check enemies
    for (let pet of this.abilityQueueService.getTeam(
      eatingPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
    }
  }

  // Perk gain events handler
  triggerPerkGainEvents(perkPet: Pet, perkType?: string) {
    // Check friends
    for (let pet of this.abilityQueueService.getTeam(perkPet)) {
      this.abilityQueueService.triggerAbility(
        pet,
        'FriendlyGainsPerk',
        perkPet,
      );
      if (perkType === 'Strawberry') {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendlyGainedStrawberry',
          perkPet,
        );
      }
      if (pet == perkPet) {
        this.abilityQueueService.triggerAbility(pet, 'ThisGainedPerk', perkPet);
        // Special perk types
        if (perkType === 'Strawberry') {
          this.abilityQueueService.triggerAbility(
            pet,
            'ThisGainedStrawberry',
            perkPet,
          );
        }
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendGainsPerk',
          perkPet,
        );
        // Special perk types for friends
        if (perkType === 'Strawberry') {
          this.abilityQueueService.triggerAbility(
            pet,
            'FriendGainedStrawberry',
            perkPet,
          );
        }
      }
    }
  }

  // Perk loss events handler
  triggerPerkLossEvents(perkPet: Pet, perkType?: string) {
    // Check friends
    for (let pet of this.abilityQueueService.getTeam(perkPet)) {
      this.abilityQueueService.triggerAbility(pet, 'PetLostPerk', perkPet);
      if (perkType === 'strawberry') {
        this.abilityQueueService.triggerAbility(pet, 'LostStrawberry', perkPet);
      }
      if (pet == perkPet) {
        this.abilityQueueService.triggerAbility(pet, 'ThisLostPerk', perkPet);
      } else {
        this.abilityQueueService.triggerAbility(pet, 'FriendLostPerk', perkPet);
        // Special perk types for friends
        if (perkType === 'strawberry') {
          this.abilityQueueService.triggerAbility(
            pet,
            'FriendLostStrawberry',
            perkPet,
          );
        }
      }
    }

    // Check enemies
    for (let pet of this.abilityQueueService.getTeam(
      perkPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(pet, 'PetLostPerk', perkPet);
    }
  }

  // Ailment events handler
  triggerAilmentGainEvents(ailmentPet: Pet, ailmentType?: string) {
    // Check friends
    for (let pet of this.abilityQueueService.getTeam(ailmentPet)) {
      this.abilityQueueService.triggerAbility(
        pet,
        'AnyoneGainedAilment',
        ailmentPet,
      );
      if (pet == ailmentPet) {
        this.abilityQueueService.triggerAbility(
          pet,
          'ThisGainedAilment',
          ailmentPet,
        );
      } else {
        this.abilityQueueService.triggerAbility(
          pet,
          'FriendGainsAilment',
          ailmentPet,
        );
      }
      // Special ailment types
      if (ailmentType === 'weak') {
        this.abilityQueueService.triggerAbility(
          pet,
          'AnyoneGainedWeak',
          ailmentPet,
        );
      }
    }

    // Check enemies
    for (let pet of this.abilityQueueService.getTeam(
      ailmentPet.parent?.opponent,
    )) {
      this.abilityQueueService.triggerAbility(
        pet,
        'EnemyGainedAilment',
        ailmentPet,
      );
      this.abilityQueueService.triggerAbility(
        pet,
        'AnyoneGainedAilment',
        ailmentPet,
      );
      // Special ailment types
      if (ailmentType === 'weak') {
        this.abilityQueueService.triggerAbility(
          pet,
          'AnyoneGainedWeak',
          ailmentPet,
        );
      }
    }
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
    // Handle ThisKilled for the killer pet
    this.abilityQueueService.triggerAbility(killedPet, 'ThisKilled', killerPet);

    // Check if killed pet was an enemy
    if (killedPet.parent !== killerPet.parent) {
      this.abilityQueueService.triggerAbility(
        killerPet,
        'ThisKilledEnemy',
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
    let player = levelUpPet.parent as any;
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
      this.abilityQueueService.triggerAbility(pet, 'ClearFront');
      pet.clearFrontTriggered = true;
    }
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
