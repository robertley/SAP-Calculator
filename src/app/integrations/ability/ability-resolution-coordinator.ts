import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityQueueService } from './ability-queue.service';

export type AbilityEventFilter = (event: AbilityEvent) => boolean;

export interface ResolutionPhase {
  phaseFilter: AbilityEventFilter;
  nonPhaseFilter: AbilityEventFilter;
  interleaveNonPhaseEvents: boolean;
  lockNonPhaseExecution?: boolean;
}

/**
 * Coordinates phase-specific queue draining around the global event order.
 *
 * Game rules enqueue reactions freely. This class is the only phase-level
 * queue consumer: it registers pending deaths before a non-phase drain, then
 * lets AbilityQueueService apply the configured trigger priorities.
 */
export class AbilityResolutionCoordinator {
  private nonPhaseExecutionLocked = false;

  constructor(
    private readonly abilityQueueService: AbilityQueueService,
    private readonly getGameApi: () => GameAPI,
    private readonly onExecute: (event: AbilityEvent) => void,
  ) {}

  get isNonPhaseExecutionLocked(): boolean {
    return this.nonPhaseExecutionLocked;
  }

  drain(
    filter: AbilityEventFilter,
    options: { synchronizeDeaths?: boolean } = {},
  ): void {
    if (options.synchronizeDeaths) {
      this.synchronizeDeaths();
    }
    this.abilityQueueService.processQueue(this.getGameApi(), {
      filter,
      onExecute: this.onExecute,
    });
  }

  resolvePhase(phase: ResolutionPhase): void {
    const previousLock = this.nonPhaseExecutionLocked;
    if (phase.lockNonPhaseExecution) {
      this.nonPhaseExecutionLocked = true;
    }

    try {
      while (true) {
        const event = this.abilityQueueService.takeNextMatchingEvent(
          phase.phaseFilter,
        );
        if (!event) {
          break;
        }

        this.onExecute(event);
        this.abilityQueueService.executeEvent(event, this.getGameApi());

        if (phase.interleaveNonPhaseEvents) {
          this.drain(phase.nonPhaseFilter, { synchronizeDeaths: true });
        }
      }
    } finally {
      if (phase.lockNonPhaseExecution) {
        this.nonPhaseExecutionLocked = previousLock;
      }
    }

    if (!phase.interleaveNonPhaseEvents) {
      this.drain(phase.nonPhaseFilter, { synchronizeDeaths: true });
    }
  }

  synchronizeDeaths(): void {
    const gameApi = this.getGameApi();
    gameApi.player.checkPetsAlive();
    gameApi.opponent.checkPetsAlive();
  }
}
