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
import { coerceLogService } from 'app/runtime/log-service-fallback';
import {
  AbilityEventFilter,
  AbilityResolutionCoordinator,
} from './ability-resolution-coordinator';

@Injectable({
  providedIn: 'root',
})
export class AbilityService extends AbilityEventTriggers {
  declare public gameApi: GameAPI;
  declare protected lastLoggedTrigger?: AbilityTrigger;
  private readonly resolutionCoordinator: AbilityResolutionCoordinator;

  constructor(
    protected gameService: GameService,
    private logService: LogService,
    protected toyEventService: ToyEventService,
    protected abilityQueueService: AbilityQueueService,
    private attackEventService: AttackEventService,
    protected faintEventService: FaintEventService,
  ) {
    super();
    this.logService = coerceLogService(this.logService);
    this.resolutionCoordinator = new AbilityResolutionCoordinator(
      this.abilityQueueService,
      () => this.gameService.gameApi,
      (event) => this.logQueuedEvent(event),
    );
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
    this.executeQueuedEvent(event);
    if (!this.hasGlobalEvents) {
      this.lastLoggedTrigger = undefined;
    }
  }

  private executeQueuedEvent(event: AbilityEvent): void {
    this.logQueuedEvent(event);
    this.abilityQueueService.executeEvent(event, this.gameService.gameApi);
  }

  private logQueuedEvent(event: AbilityEvent): void {
    if (event.customParams?.isDeathLog !== true) {
      this.logTriggerHeader(event);
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

  simulateFriendHurtCounters(pet: Pet, count: number) {
    this.abilityQueueService.simulateFriendHurtCounters(pet, count);
  }

  queueDeathLog(pet: Pet): void {
    // The log belongs to the Faint phase, rather than death detection. This
    // lets higher-priority Hurt events resolve before it and KnockOut events
    // resolve afterward according to ABILITY_PRIORITIES.
    this.abilityQueueService.addEventToQueue({
      priority: Number.MAX_SAFE_INTEGER,
      callback: () => {
        this.logService.createLog({
          message: `${pet.name} fainted.`,
          type: 'death',
          player: pet.parent,
          sourcePet: pet,
        });
      },
      pet,
      triggerPet: pet,
      abilityType: 'Faint',
      customParams: { isDeathLog: true },
    });
  }

  protected executeQueueEvents(
    filter: AbilityEventFilter,
    synchronizeDeaths: boolean = false,
  ): void {
    this.resolutionCoordinator.drain(filter, { synchronizeDeaths });
  }

  synchronizePendingDeaths(): void {
    this.resolutionCoordinator.synchronizeDeaths();
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

  triggerEndTurnEvents() {
    this.gameApi = this.gameService.gameApi;

    for (const pet of this.gameApi.player.petArray) {
      if (pet.hasTrigger('EndTurn')) {
        this.abilityQueueService.triggerAbility(pet, 'EndTurn');
      }
    }
    for (const pet of this.gameApi.opponent.petArray) {
      if (pet.hasTrigger('EndTurn')) {
        this.abilityQueueService.triggerAbility(pet, 'EndTurn');
      }
    }
  }

  executeEndTurnEvents() {
    this.resolvePhaseEvents(new Set(['EndTurn']), true);
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
    this.resolvePhaseEvents(new Set(['BeforeStartBattle']), false, true);
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
    this.resolvePhaseEvents(new Set(['StartBattle']), false, true);
  }

  // Before Attack
  triggerBeforeAttackEvent(AttackingPet: Pet) {
    this.attackEventService.triggerBeforeAttackEvents(AttackingPet);
  }

  executeBeforeAttackEvents() {
    if (this.resolutionCoordinator.isNonPhaseExecutionLocked) {
      return;
    }
    const beforeAttackTriggers = new Set([
      'BeforeFriendlyAttack',
      'BeforeThisAttacks',
      'BeforeFirstAttack',
      'BeforeFriendAttacks',
      'BeforeAdjacentFriendAttacked',
    ]);
    const startBattleTriggers = new Set([
      'BeforeStartBattle',
      'StartBattle',
    ]);
    this.executeQueueEvents(
      this.createTriggerFilter(beforeAttackTriggers),
    );
    this.executeQueueEvents(
      (event) => !startBattleTriggers.has(event.abilityType as string),
      true,
    );
    this.clearLastLoggedTrigger();
  }

  executeBeforeAttackTriggerOnly() {
    if (this.resolutionCoordinator.isNonPhaseExecutionLocked) {
      return;
    }
    const beforeAttackTriggers = new Set([
      'BeforeFriendlyAttack',
      'BeforeThisAttacks',
      'BeforeFirstAttack',
      'BeforeFriendAttacks',
      'BeforeAdjacentFriendAttacked',
    ]);
    this.executeQueueEvents(this.createTriggerFilter(beforeAttackTriggers));
    this.clearLastLoggedTrigger();
  }

  // Friend/After attacks events
  triggerAttacksEvents(AttackingPet: Pet) {
    this.attackEventService.triggerAfterAttackEvents(AttackingPet);
  }

  executeAfterAttackEvents() {
    if (this.resolutionCoordinator.isNonPhaseExecutionLocked) {
      return;
    }
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
    const startBattleTriggers = new Set([
      'BeforeStartBattle',
      'StartBattle',
    ]);
    this.executeQueueEvents(
      (event) => {
        const trigger = event.abilityType as string;
        if (afterAttackTriggers.has(trigger)) {
          return true;
        }
        return /^(FriendlyAttacked|FriendAttacked|EnemyAttacked)\d+$/.test(
          trigger,
        );
      },
    );
    this.executeQueueEvents(
      (event) => !startBattleTriggers.has(event.abilityType as string),
      true,
    );
    this.clearLastLoggedTrigger();
  }

  private resolvePhaseEvents(
    phaseTriggers: ReadonlySet<string>,
    interleaveNonPhaseEvents: boolean,
    lockNonPhaseExecution: boolean = false,
  ): void {
    const phaseFilter = this.createTriggerFilter(phaseTriggers);
    this.resolutionCoordinator.resolvePhase({
      phaseFilter,
      nonPhaseFilter: (event) => !phaseFilter(event),
      interleaveNonPhaseEvents,
      lockNonPhaseExecution,
    });
    this.clearLastLoggedTrigger();
  }

  private createTriggerFilter(
    triggers: ReadonlySet<string>,
  ): AbilityEventFilter {
    return (event) => triggers.has(event.abilityType as string);
  }


}

