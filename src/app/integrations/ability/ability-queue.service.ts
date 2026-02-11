import { Injectable } from '@angular/core';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { AbilityTrigger } from 'app/domain/entities/ability.class';
import { Pet } from 'app/domain/entities/pet.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { ABILITY_PRIORITIES } from './ability-priorities';
import {
  processEventQueue,
  executeEventWithTransform,
} from './event-queue-processing';
import { getRandomFloat } from 'app/runtime/random';

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

  addEventToQueue(event: AbilityEvent) {
    // Set priority based on ability type
    const abilityPriority = this.getAbilityPriority(event.abilityType);

    // Assign random tie breaker if not already set
    event.tieBreaker = getRandomFloat();

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
        if (event.priority > midEvent.priority) {
          right = mid;
        } else if (event.priority < midEvent.priority) {
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
    processEventQueue(this.globalEventQueue, gameApi, options);
  }

  getNextHighestPriorityEvent(): AbilityEvent | null {
    return this.globalEventQueue.shift() || null;
  }

  // NEW: Legacy support
  peekNextHighestPriorityEvent(): AbilityEvent | null {
    return this.globalEventQueue.length > 0 ? this.globalEventQueue[0] : null;
  }

  executeEvent(event: AbilityEvent, gameApi: GameAPI) {
    executeEventWithTransform(event, gameApi);
  }

  // --- Priority Helpers ---

  getAbilityPriority(trigger: AbilityTrigger): number {
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
    let priority = pet.attack;
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
        tieBreaker: getRandomFloat(),
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



