import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import {
  AbilityCustomParams,
  AbilityTrigger,
} from 'app/domain/entities/ability.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { getRandomInt } from 'app/runtime/random';

type ProcessQueueOptions = {
  shuffle?: boolean;
  filter?: (event: AbilityEvent) => boolean;
  onExecute?: (event: AbilityEvent) => void;
};

function getAbilityExecutorTarget(event: AbilityEvent) {
  const executingPet = event.pet;
  if (!executingPet) {
    return null;
  }
  return executingPet.transformed && executingPet.transformedInto
    ? executingPet.transformedInto
    : executingPet;
}

function executeAndNotify(
  event: AbilityEvent,
  gameApi: GameAPI,
  onExecute?: (event: AbilityEvent) => void,
): void {
  if (onExecute) {
    onExecute(event);
  }
  executeEventWithTransform(event, gameApi);
}

function executeFilteredEvents(
  queue: AbilityEvent[],
  gameApi: GameAPI,
  filter: (event: AbilityEvent) => boolean,
  onExecute?: (event: AbilityEvent) => void,
): void {
  let nextIndex = queue.findIndex(filter);
  while (nextIndex !== -1) {
    const [event] = queue.splice(nextIndex, 1);
    if (!event) {
      break;
    }
    executeAndNotify(event, gameApi, onExecute);
    nextIndex = queue.findIndex(filter);
  }
}

/**
 * Sorts events by priority (descending) with tieBreaker for equal priorities.
 * Higher priority values execute first.
 */
export function sortEventsByPriority(events: AbilityEvent[]): void {
  events.sort(
    (a, b) =>
      b.priority - a.priority || (b.tieBreaker ?? 0) - (a.tieBreaker ?? 0),
  );
}

/**
 * Executes an event callback, handling pet transformation if applicable.
 * If the pet has transformed, the callback is redirected to the transformed pet.
 */
export function executeEventWithTransform(
  event: AbilityEvent,
  gameApi: GameAPI,
  customParams?: AbilityCustomParams,
): void {
  if (event.callback) {
    const executingPet = event.pet;
    if (
      executingPet &&
      executingPet.transformed &&
      executingPet.transformedInto &&
      event.abilityType
    ) {
      const transformedPet = executingPet.transformedInto;
      // Replace the callback with the transformed pet's method
      event.callback = (trigger: AbilityTrigger, api: GameAPI) => {
        transformedPet.executeAbilities(
          trigger,
          api,
          event.triggerPet,
          undefined,
          undefined,
          customParams,
        );
      };
    }
    event.callback(event.abilityType, gameApi, event.triggerPet);
    return;
  }

  const targetPet = getAbilityExecutorTarget(event);
  if (targetPet && event.abilityType) {
    // New optimize path
    targetPet.executeAbilities(
      event.abilityType,
      gameApi,
      event.triggerPet,
      undefined,
      undefined,
      event.customParams || customParams,
    );
  }
}

/**
 * Processes an event queue by sorting by priority and executing each event.
 * Clears the queue after processing.
 */
export function processEventQueue(
  queue: AbilityEvent[],
  gameApi: GameAPI,
  options?: ProcessQueueOptions,
): void {
  if (options?.shuffle) {
    // Fisher-Yates shuffle for randomization of equal-priority events
    for (let i = queue.length - 1; i > 0; i--) {
      const j = getRandomInt(0, i);
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  // Queue order is maintained by AbilityQueueService.addEventToQueue.
  // Do not re-sort here or we will lose trigger priority ordering.
  if (options?.filter) {
    executeFilteredEvents(queue, gameApi, options.filter, options.onExecute);
    return;
  }

  while (queue.length > 0) {
    const event = queue.shift()!;
    executeAndNotify(event, gameApi, options?.onExecute);
  }
}

