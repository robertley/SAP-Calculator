import { AbilityEvent } from "../../interfaces/ability-event.interface";
import { AbilityTrigger } from "../../classes/ability.class";
import { GameAPI } from "../../interfaces/gameAPI.interface";

/**
 * Sorts events by priority (descending) with tieBreaker for equal priorities.
 * Higher priority values execute first.
 */
export function sortEventsByPriority(events: AbilityEvent[]): void {
    events.sort((a, b) => (b.priority - a.priority) || ((b.tieBreaker ?? 0) - (a.tieBreaker ?? 0)));
}

/**
 * Executes an event callback, handling pet transformation if applicable.
 * If the pet has transformed, the callback is redirected to the transformed pet.
 */
export function executeEventWithTransform(
    event: AbilityEvent,
    gameApi: GameAPI,
    customParams?: any
): void {
    const executingPet = event.pet;

    if (executingPet && executingPet.transformed && executingPet.transformedInto && event.abilityType) {
        const transformedPet = executingPet.transformedInto;
        // Replace the callback with the transformed pet's method
        event.callback = (trigger: AbilityTrigger, api: GameAPI) => {
            transformedPet.executeAbilities(trigger, api, event.triggerPet, undefined, undefined, customParams);
        };
    }

    event.callback(event.abilityType, gameApi, event.triggerPet);
}

/**
 * Processes an event queue by sorting by priority and executing each event.
 * Clears the queue after processing.
 */
export function processEventQueue(
    queue: AbilityEvent[],
    gameApi: GameAPI,
    options?: {
        shuffle?: boolean;
        filter?: (event: AbilityEvent) => boolean;
        onExecute?: (event: AbilityEvent) => void;
    }
): void {
    if (options?.shuffle) {
        // Fisher-Yates shuffle for randomization of equal-priority events
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
    }

    // Queue order is maintained by AbilityQueueService.addEventToQueue.
    // Do not re-sort here or we will lose trigger priority ordering.

    const remaining: AbilityEvent[] = [];
    while (queue.length > 0) {
        const event = queue.shift()!;
        if (options?.filter && !options.filter(event)) {
            remaining.push(event);
            continue;
        }
        if (options?.onExecute) {
            options.onExecute(event);
        }
        executeEventWithTransform(event, gameApi);
    }

    if (remaining.length > 0) {
        queue.push(...remaining);
    }
}
