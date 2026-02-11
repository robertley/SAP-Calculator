import { Injectable } from '@angular/core';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { AbilityTrigger } from 'app/domain/entities/ability.class';
import { Pet } from 'app/domain/entities/pet.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { ABILITY_PRIORITIES } from './ability-priorities';
import {
  executeEventWithTransform,
} from './event-queue-processing';

@Injectable({
  providedIn: 'root',
})
export class AbilityQueueService {
  public globalEventQueue: AbilityEvent[] = [];
  private numberedTriggerCache = new WeakMap<
    Pet,
    {
      listRef: Pet['abilityList'];
      listLength: number;
      prefixMap: Map<string, AbilityTrigger[]>;
    }
  >();
  private numberedTriggerRegexCache = new Map<string, RegExp>();

  constructor() { }

  // --- Queue Management ---

  private getEventAbilityPriority(event: AbilityEvent): number {
    if (!event.abilityType) {
      return 999;
    }
    return this.getAbilityPriority(event.abilityType);
  }

  private getCurrentEventPriority(event: AbilityEvent): number {
    if (event.pet) {
      return this.getPetEventPriority(event.pet);
    }
    const queuedPriority = Number(event.priority ?? 0);
    return Number.isFinite(queuedPriority) ? queuedPriority : 0;
  }

  private compareEventsForExecution(a: AbilityEvent, b: AbilityEvent): number {
    const abilityPriorityDiff =
      this.getEventAbilityPriority(a) - this.getEventAbilityPriority(b);
    if (abilityPriorityDiff !== 0) {
      return abilityPriorityDiff;
    }

    const eventPriorityDiff =
      this.getCurrentEventPriority(b) - this.getCurrentEventPriority(a);
    if (eventPriorityDiff !== 0) {
      return eventPriorityDiff;
    }

    return (a.tieBreaker ?? 0) - (b.tieBreaker ?? 0);
  }

  private getNextHighestPriorityEventIndex(
    filter?: (event: AbilityEvent) => boolean,
  ): number {
    let bestIdx = -1;
    for (let i = 0; i < this.globalEventQueue.length; i++) {
      const event = this.globalEventQueue[i];
      if (filter && !filter(event)) {
        continue;
      }
      if (bestIdx === -1) {
        bestIdx = i;
        continue;
      }
      const currentBest = this.globalEventQueue[bestIdx];
      if (this.compareEventsForExecution(event, currentBest) < 0) {
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  addEventToQueue(event: AbilityEvent) {
    // Set priority based on ability type
    const abilityPriority = this.getAbilityPriority(event.abilityType);

    // Assign random tie breaker if not already set
    event.tieBreaker = Math.random();

    // Binary search to find insertion point (Descending priority)
    let left = 0;
    let right = this.globalEventQueue.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const midEvent = this.globalEventQueue[mid];
      const midAbilityPriority = this.getAbilityPriority(midEvent.abilityType);

      // Compare ability type priority first
      if (abilityPriority < midAbilityPriority) {
        right = mid;
      } else if (abilityPriority > midAbilityPriority) {
        left = mid + 1;
      } else {
        // Same ability type priority, compare individual event priority (higher = first)
        const eventPriorityRaw = Number(event.priority ?? 0);
        const midPriorityRaw = Number(midEvent.priority ?? 0);
        const eventPriority = Number.isFinite(eventPriorityRaw)
          ? eventPriorityRaw
          : 0;
        const midPriority = Number.isFinite(midPriorityRaw)
          ? midPriorityRaw
          : 0;
        if (eventPriority > midPriority) {
          right = mid;
        } else if (eventPriority < midPriority) {
          left = mid + 1;
        } else {
          // Same priority - use random tie breaker (lower tieBreaker = first)
          const eventTieBreaker = event.tieBreaker ?? 0;
          const midTieBreaker = midEvent.tieBreaker ?? 0;
          if (eventTieBreaker < midTieBreaker) {
            right = mid;
          } else {
            left = mid + 1;
          }
        }
      }
    }

    this.globalEventQueue.splice(left, 0, event);
  }

  clearGlobalEventQueue() {
    this.globalEventQueue = [];
  }

  get hasGlobalEvents(): boolean {
    return this.globalEventQueue.length > 0;
  }

  processQueue(
    gameApi: GameAPI,
    options?: {
      shuffle?: boolean;
      filter?: (event: AbilityEvent) => boolean;
      onExecute?: (event: AbilityEvent) => void;
    },
  ) {
    if (options?.shuffle) {
      for (let i = this.globalEventQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.globalEventQueue[i], this.globalEventQueue[j]] = [
          this.globalEventQueue[j],
          this.globalEventQueue[i],
        ];
      }
    }

    while (true) {
      const nextIdx = this.getNextHighestPriorityEventIndex(options?.filter);
      if (nextIdx === -1) {
        break;
      }
      const [event] = this.globalEventQueue.splice(nextIdx, 1);
      if (options?.onExecute) {
        options.onExecute(event);
      }
      executeEventWithTransform(event, gameApi);
    }
  }

  getNextHighestPriorityEvent(): AbilityEvent | null {
    return this.getNextHighestPriorityEventMatching();
  }

  // NEW: Legacy support
  peekNextHighestPriorityEvent(): AbilityEvent | null {
    return this.peekNextHighestPriorityEventMatching();
  }

  getNextHighestPriorityEventMatching(
    filter?: (event: AbilityEvent) => boolean,
  ): AbilityEvent | null {
    const nextIdx = this.getNextHighestPriorityEventIndex(filter);
    if (nextIdx === -1) {
      return null;
    }
    const [event] = this.globalEventQueue.splice(nextIdx, 1);
    return event ?? null;
  }

  peekNextHighestPriorityEventMatching(
    filter?: (event: AbilityEvent) => boolean,
  ): AbilityEvent | null {
    const nextIdx = this.getNextHighestPriorityEventIndex(filter);
    if (nextIdx === -1) {
      return null;
    }
    return this.globalEventQueue[nextIdx] ?? null;
  }

  executeEvent(event: AbilityEvent, gameApi: GameAPI) {
    executeEventWithTransform(event, gameApi);
  }

  // --- Priority Helpers ---

  getAbilityPriority(trigger?: AbilityTrigger): number {
    if (!trigger) {
      return 999;
    }
    const direct = ABILITY_PRIORITIES[trigger];
    if (direct != null) {
      return direct;
    }
    if (/\d+$/.test(trigger)) {
      return (ABILITY_PRIORITIES as any).CounterEvent ?? 999;
    }
    return 999;
  }

  getPriorityNumber(abilityType: string): number {
    return this.getAbilityPriority(abilityType as AbilityTrigger);
  }

  getPetEventPriority(pet: Pet): number {
    let priority = Number(pet.attack ?? 0);
    if (!Number.isFinite(priority)) {
      priority = 0;
    }
    if (pet.equipment?.name === 'Churros') {
      priority += 1000;
    } else if (pet.equipment?.name === 'Macaron') {
      priority -= 1000;
    }
    return priority;
  }

  // --- Trigger Logic ---

  triggerAbility(
    pet: Pet,
    trigger: AbilityTrigger,
    triggerPet?: Pet,
    customParams?: any,
  ): void {
    if (pet.hasTrigger(trigger)) {
      let eventPriority = this.getPetEventPriority(pet);
      // Perk-self events should resolve before ally perk events for FriendlyGainsPerk users.
      if (trigger === 'FriendlyGainsPerk' && pet === triggerPet) {
        eventPriority += 10000;
      }

      const eventCustomParams = {
        ...(customParams ?? {}),
        trigger,
        tigerSupportPet: pet.petBehind(true, true) ?? null,
      };

      const abilityEvent: AbilityEvent = {
        // callback: Removed for performance
        priority: eventPriority,
        pet: pet,
        triggerPet: triggerPet,
        abilityType: trigger,
        tieBreaker: Math.random(),
        customParams: eventCustomParams,
      };

      this.addEventToQueue(abilityEvent);
    }
  }

  simulatePostRemovalFriendFaintsCounters(pet: Pet, count: number) {
    if (!pet || count <= 0) {
      return;
    }
    const triggers = this.getNumberedTriggersForPet(pet, 'PostRemovalFriendFaints');
    for (let i = 0; i < count; i++) {
      this.handleNumberedCounterTriggers(pet, undefined, undefined, triggers);
    }
  }

  // --- Counter Helpers ---

  handleCounterTriggers(
    pet: Pet,
    triggerPet: Pet | undefined,
    customParams: any,
    counters: Array<{ trigger: AbilityTrigger; modulo: number }>,
  ): void {
    for (const counter of counters) {
      if (!pet.hasTrigger(counter.trigger)) {
        continue;
      }
      pet.abilityCounter++;
      if (pet.abilityCounter % counter.modulo === 0) {
        this.triggerAbility(pet, counter.trigger, triggerPet, customParams);
      }
    }
  }

  getTriggerModulo(trigger: AbilityTrigger): number | null {
    const match = trigger.match(/(\d+)$/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  }

  handleNumberedCounterTriggers(
    pet: Pet,
    triggerPet: Pet | undefined,
    customParams: any,
    triggers: AbilityTrigger[],
  ): void {
    const counters = triggers
      .map((trigger) => ({
        trigger,
        modulo: this.getTriggerModulo(trigger),
      }))
      .filter(
        (counter): counter is { trigger: AbilityTrigger; modulo: number } =>
          counter.modulo != null,
      );

    if (counters.length === 0) {
      return;
    }

    this.handleCounterTriggers(pet, triggerPet, customParams, counters);
  }

  getNumberedTriggersForPet(pet: Pet, prefix: string): AbilityTrigger[] {
    const abilityList = pet.abilityList;
    let cache = this.numberedTriggerCache.get(pet);
    if (
      !cache ||
      cache.listRef !== abilityList ||
      cache.listLength !== abilityList.length
    ) {
      cache = {
        listRef: abilityList,
        listLength: abilityList.length,
        prefixMap: new Map(),
      };
      this.numberedTriggerCache.set(pet, cache);
    }

    const cached = cache.prefixMap.get(prefix);
    if (cached) {
      return cached;
    }

    const triggers = new Set<AbilityTrigger>();
    let numberedTriggerRegex = this.numberedTriggerRegexCache.get(prefix);
    if (!numberedTriggerRegex) {
      numberedTriggerRegex = new RegExp(`^${prefix}\\d+$`);
      this.numberedTriggerRegexCache.set(prefix, numberedTriggerRegex);
    }

    for (const ability of abilityList) {
      for (const trigger of ability.triggers ?? []) {
        if (numberedTriggerRegex.test(trigger)) {
          triggers.add(trigger);
        }
      }
    }

    const result = Array.from(triggers);
    cache.prefixMap.set(prefix, result);
    return result;
  }

  public getTeam(petOrPlayer: any): Pet[] {
    const parent = petOrPlayer?.parent ?? petOrPlayer;
    const arr = parent?.petArray;
    return Array.isArray(arr) ? arr : [];
  }
}



