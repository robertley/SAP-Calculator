import { Injectable } from '@angular/core';
import { Player } from 'app/domain/entities/player.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { GameService } from 'app/runtime/state/game.service';
import { Pet } from 'app/domain/entities/pet.class';
import { LogService } from '../log.service';
import { AbilityTrigger } from 'app/domain/entities/ability.class';
import { ToyEventService } from './toy-event.service';
import { AbilityQueueService } from './ability-queue.service';
import { AttackEventService } from './attack-event.service';
import { FaintEventService } from './faint-event.service';
import { AbilityEventTriggers } from './ability-event-triggers';

@Injectable({
  providedIn: 'root',
})
export class AbilityService extends AbilityEventTriggers {
  public gameApi!: GameAPI;
  protected lastLoggedTrigger?: AbilityTrigger;
  protected gameService: GameService;
  private logService: LogService;
  protected toyEventService: ToyEventService;
  protected abilityQueueService: AbilityQueueService;
  private attackEventService: AttackEventService;
  protected faintEventService: FaintEventService;

  constructor(
    gameService: GameService,
    logService: LogService,
    toyEventService: ToyEventService,
    abilityQueueService: AbilityQueueService,
    attackEventService: AttackEventService,
    faintEventService: FaintEventService,
  ) {
    super();
    this.gameService = gameService;
    this.logService = logService;
    this.toyEventService = toyEventService;
    this.abilityQueueService = abilityQueueService;
    this.attackEventService = attackEventService;
    this.faintEventService = faintEventService;
  }

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

  getQueueSnapshot(): AbilityEvent[] {
    return [...this.abilityQueueService.globalEventQueue];
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

  protected logTriggerHeader(event: AbilityEvent) {
    if (!this.logService.isShowTriggerNamesInLogs()) {
      this.lastLoggedTrigger = undefined;
      return;
    }
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

  protected clearLastLoggedTrigger(): void {
    this.lastLoggedTrigger = undefined;
  }

  simulatePostRemovalFriendFaintsCounters(pet: Pet, count: number) {
    this.abilityQueueService.simulatePostRemovalFriendFaintsCounters(pet, count);
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
    this.processPhaseWithInterleaving(new Set(['BeforeStartBattle']));
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
    this.processPhaseWithInterleaving(new Set(['StartBattle']));
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
    const phaseTriggers = new Set(['BeforeStartBattle', 'StartBattle']);
    this.abilityQueueService.processQueue(this.gameService.gameApi, {
      filter: (event) => beforeAttackTriggers.has(event.abilityType as string),
      onExecute: (event) => this.logTriggerHeader(event),
    });
    this.abilityQueueService.processQueue(this.gameService.gameApi, {
      filter: (event) => !phaseTriggers.has(event.abilityType as string),
      onExecute: (event) => this.logTriggerHeader(event),
    });
    this.lastLoggedTrigger = undefined;
  }

  // Friend/After attacks events
  triggerAttacksEvents(AttackingPet: Pet) {
    this.attackEventService.triggerAfterAttackEvents(AttackingPet);
  }

  executeAfterAttackEvents() {
    const afterAttackTriggers = new Set([
      'FriendlyAttacked',
      'FriendAttacked',
      'FriendAheadAttacked',
      'AdjacentFriendAttacked',
      'AnyoneAttack',
      'EnemyAttacked',
      'ThisAttacked',
      'ThisFirstAttack',
    ]);
    const phaseTriggers = new Set(['BeforeStartBattle', 'StartBattle']);
    this.abilityQueueService.processQueue(this.gameService.gameApi, {
      filter: (event) => {
        const trigger = event.abilityType as string;
        if (afterAttackTriggers.has(trigger)) {
          return true;
        }
        return /^(FriendlyAttacked|FriendAttacked|EnemyAttacked)\d+$/.test(
          trigger,
        );
      },
      onExecute: (event) => this.logTriggerHeader(event),
    });
    this.abilityQueueService.processQueue(this.gameService.gameApi, {
      filter: (event) => !phaseTriggers.has(event.abilityType as string),
      onExecute: (event) => this.logTriggerHeader(event),
    });
    this.lastLoggedTrigger = undefined;
  }

  private takeNextPhaseEvent(allowedTriggers: Set<string>): AbilityEvent | null {
    const queue = this.abilityQueueService.globalEventQueue;
    let bestIdx = -1;

    for (let i = 0; i < queue.length; i++) {
      const event = queue[i];
      if (!allowedTriggers.has(event.abilityType as string)) {
        continue;
      }

      if (bestIdx === -1) {
        bestIdx = i;
        continue;
      }

      const currentBest = queue[bestIdx];
      const eventAbilityPriority = this.abilityQueueService.getPriorityNumber(
        event.abilityType as string,
      );
      const bestAbilityPriority = this.abilityQueueService.getPriorityNumber(
        currentBest.abilityType as string,
      );

      if (eventAbilityPriority < bestAbilityPriority) {
        bestIdx = i;
        continue;
      }
      if (eventAbilityPriority > bestAbilityPriority) {
        continue;
      }

      const eventPet =
        event.pet?.transformed && event.pet?.transformedInto
          ? event.pet.transformedInto
          : event.pet;
      const bestPet =
        currentBest.pet?.transformed && currentBest.pet?.transformedInto
          ? currentBest.pet.transformedInto
          : currentBest.pet;

      const eventPriority = eventPet
        ? this.abilityQueueService.getPetEventPriority(eventPet)
        : Number(event.priority ?? 0);
      const bestPriority = bestPet
        ? this.abilityQueueService.getPetEventPriority(bestPet)
        : Number(currentBest.priority ?? 0);

      if (eventPriority > bestPriority) {
        bestIdx = i;
        continue;
      }
      if (eventPriority < bestPriority) {
        continue;
      }

      const eventTie = Number(event.tieBreaker ?? 0);
      const bestTie = Number(currentBest.tieBreaker ?? 0);
      if (eventTie < bestTie) {
        bestIdx = i;
      }
    }

    if (bestIdx === -1) {
      return null;
    }

    const [event] = queue.splice(bestIdx, 1);
    return event ?? null;
  }

  private processPhaseWithInterleaving(allowedTriggers: Set<string>) {
    while (true) {
      const event = this.takeNextPhaseEvent(allowedTriggers);
      if (!event) {
        break;
      }
      this.logTriggerHeader(event);
      this.abilityQueueService.executeEvent(event, this.gameService.gameApi);
      this.abilityQueueService.processQueue(this.gameService.gameApi, {
        filter: (evt) => !allowedTriggers.has(evt.abilityType as string),
        onExecute: (evt) => this.logTriggerHeader(evt),
      });
    }
    this.lastLoggedTrigger = undefined;
  }


}
