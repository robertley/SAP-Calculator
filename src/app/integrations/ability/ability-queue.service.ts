import { Injectable } from '@angular/core';
import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import {
  AbilityCustomParams,
  AbilityTrigger,
} from 'app/domain/entities/ability.class';
import { Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
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
  private static readonly BEFORE_ATTACK_PRIORITY_BONUS = 20000;
  private static readonly FRIENDLY_GAINS_PERK_SELF_PRIORITY_BONUS = 10000;
  private static readonly CHURROS_PRIORITY_OFFSET = 1000;
  private static readonly MACARON_PRIORITY_OFFSET = -1000;

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
    // Assign random tie breaker if not already set
    event.tieBreaker = getRandomFloat();

    const insertionIndex = this.findEventInsertionIndex(event);
    this.globalEventQueue.splice(insertionIndex, 0, event);
  }

  private findEventInsertionIndex(event: AbilityEvent): number {
    let left = 0;
    let right = this.globalEventQueue.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const midEvent = this.globalEventQueue[mid];
      const compareResult = this.compareEventsForQueueOrder(event, midEvent);

      if (compareResult < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  private compareEventsForQueueOrder(a: AbilityEvent, b: AbilityEvent): number {
    const abilityPriorityDiff =
      this.getAbilityPriority(a.abilityType) -
      this.getAbilityPriority(b.abilityType);
    if (abilityPriorityDiff !== 0) {
      return abilityPriorityDiff;
    }

    const eventPriorityDiff = b.priority - a.priority;
    if (eventPriorityDiff !== 0) {
      return eventPriorityDiff;
    }

    const aTieBreaker = a.tieBreaker ?? 0;
    const bTieBreaker = b.tieBreaker ?? 0;
    return aTieBreaker - bTieBreaker;
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
    const baseTrigger = this.removeNumericSuffix(trigger);
    if (baseTrigger !== trigger) {
      const basePriority = ABILITY_PRIORITIES[baseTrigger];
      if (basePriority != null) {
        return basePriority;
      }
      return ABILITY_PRIORITIES.CounterEvent ?? 999;
    }
    return 999;
  }

  getPriorityNumber(abilityType: string): number {
    return this.getAbilityPriority(abilityType as AbilityTrigger);
  }

  getPetEventPriority(pet: Pet): number {
    let priority = pet.attack;
    if (pet.equipment?.name === 'Churros') {
      priority += AbilityQueueService.CHURROS_PRIORITY_OFFSET;
    } else if (pet.equipment?.name === 'Macaron') {
      priority += AbilityQueueService.MACARON_PRIORITY_OFFSET;
    }
    return priority;
  }

  // --- Trigger Logic ---

  triggerAbility(
    pet: Pet,
    trigger: AbilityTrigger,
    triggerPet?: Pet,
    customParams?: AbilityCustomParams,
  ): void {
    if (pet.hasTrigger(trigger)) {
      let eventPriority = this.getPetEventPriority(pet);
      if (trigger === 'BeforeThisAttacks' || trigger === 'BeforeFirstAttack') {
        eventPriority += AbilityQueueService.BEFORE_ATTACK_PRIORITY_BONUS;
      }
      // Perk-self events should resolve before ally perk events for FriendlyGainsPerk users.
      if (trigger === 'FriendlyGainsPerk' && pet === triggerPet) {
        eventPriority +=
          AbilityQueueService.FRIENDLY_GAINS_PERK_SELF_PRIORITY_BONUS;
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
    customParams: AbilityCustomParams | undefined,
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
    const match = this.getNumericSuffix(trigger);
    if (match) {
      return parseInt(match, 10);
    }
    return null;
  }

  handleNumberedCounterTriggers(
    pet: Pet,
    triggerPet: Pet | undefined,
    customParams: AbilityCustomParams | undefined,
    triggers: AbilityTrigger[],
  ): void {
    const counters: Array<{ trigger: AbilityTrigger; modulo: number }> = [];
    for (const trigger of triggers) {
      const modulo = this.getTriggerModulo(trigger);
      if (modulo != null) {
        counters.push({ trigger, modulo });
      }
    }

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

  private getNumericSuffix(value: string): string | null {
    const match = value.match(/(\d+)$/);
    return match ? match[1] : null;
  }

  private removeNumericSuffix(value: string): string {
    return this.getNumericSuffix(value) ? value.replace(/\d+$/, '') : value;
  }

  public getTeam(petOrPlayer?: Pet | Player | null): Pet[] {
    const parent = petOrPlayer instanceof Pet ? petOrPlayer.parent : petOrPlayer;
    const arr = parent?.petArray;
    return Array.isArray(arr) ? arr : [];
  }
}



