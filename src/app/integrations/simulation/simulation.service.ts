import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CalculatorBattleEngine } from './battle-engine';
import {
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';
import { LogService } from '../log.service';
import { Player } from 'app/domain/entities/player.class';
import { MAX_DISPLAYED_BATTLES } from './simulation.constants';
import {
  buildSimulationConfigFromForm,
} from 'app/runtime/state/simulation-form-mapper';
import {
  BoardStrengthOptions,
  BoardStrengthProgress,
  BoardStrengthResult,
  runBoardStrengthEvaluation,
} from './board-strength-evaluator';
import {
  OutFinderOptions,
  OutFinderProgress,
  OutFinderResult,
  runOutFinder,
} from './out-finder';
import type {
  FightOptimizerOptions,
  FightOptimizerResult,
  OptimizerProgress,
} from 'sap-battle-engine';

export type FightOptimizationRequestOptions = Pick<
  FightOptimizerOptions,
  | 'seed'
  | 'initialSimulations'
  | 'refinementSimulations'
  | 'collectAllBestResponses'
  | 'maxSimulations'
  | 'maxResponseSteps'
>;

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  constructor(
    private logService: LogService,
  ) {}

  runSimulationInWorker(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
    callbacks: {
      onProgress?: (progress: {
        completed: number;
        total: number;
        playerWins: number;
        opponentWins: number;
        draws: number;
        loggedBattles: number;
      }) => void;
      onResult?: (result: SimulationResult) => void;
      onAborted?: (result: SimulationResult) => void;
      onError?: (message: string) => void;
    },
    options?: { progressInterval?: number },
    configOverrides?: Partial<SimulationConfig>,
  ): Worker | null {
    if (typeof Worker === 'undefined') {
      const result = this.runSimulation(formGroup, count, player, opponent, configOverrides);
      callbacks.onResult?.(result);
      return null;
    }

    const config = this.buildConfig(formGroup, count, configOverrides);
    const showTriggerNamesInLogs =
      formGroup.get('showTriggerNamesInLogs')?.value ?? false;
    const progressInterval = options?.progressInterval ?? 50;

    const worker = new Worker(
      new URL('./simulation.worker', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = ({ data }) => {
      if (!data || !data.type) {
        return;
      }
      if (data.type === 'progress') {
        callbacks.onProgress?.(data);
      } else if (data.type === 'result') {
        callbacks.onResult?.(data.result as SimulationResult);
      } else if (data.type === 'aborted') {
        callbacks.onAborted?.(data.result as SimulationResult);
      } else if (data.type === 'error') {
        callbacks.onError?.(data.message || 'Worker simulation failed.');
      }
    };

    worker.onerror = (event) => {
      callbacks.onError?.(event.message || 'Worker simulation failed.');
    };

    worker.postMessage({
      type: 'start',
      config,
      progressInterval,
      showTriggerNamesInLogs,
    });

    return worker;
  }

  runFightOptimizationInWorker(
    formGroup: FormGroup,
    callbacks: {
      onProgress?: (progress: OptimizerProgress) => void;
      onResult?: (result: FightOptimizerResult) => void;
      onAborted?: (result: FightOptimizerResult) => void;
      onError?: (message: string) => void;
    },
    options: FightOptimizationRequestOptions = {},
  ): Worker | null {
    if (typeof Worker === 'undefined') {
      const config = this.buildConfig(formGroup, 1);
      void import('sap-battle-engine')
        .then(({ optimizeFight }) =>
          optimizeFight(config, { ...options, onProgress: callbacks.onProgress }),
        )
        .then((result) => {
          if (result.termination === 'cancelled') {
            callbacks.onAborted?.(result);
          } else {
            callbacks.onResult?.(result);
          }
        })
        .catch((error: unknown) => {
          callbacks.onError?.(
            error instanceof Error
              ? error.message
              : 'Fight optimization failed.',
          );
        });
      return null;
    }

    const config = this.buildConfig(formGroup, 1);
    const worker = new Worker(
      new URL('./simulation.worker', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = ({ data }) => {
      if (!data || !data.type) {
        return;
      }
      if (data.type === 'fight-optimizer-progress') {
        callbacks.onProgress?.(data.progress as OptimizerProgress);
      } else if (data.type === 'fight-optimizer-result') {
        callbacks.onResult?.(data.result as FightOptimizerResult);
      } else if (data.type === 'fight-optimizer-aborted') {
        callbacks.onAborted?.(data.result as FightOptimizerResult);
      } else if (data.type === 'error') {
        callbacks.onError?.(data.message || 'Fight optimization failed.');
      }
    };
    worker.onerror = (event) => {
      callbacks.onError?.(event.message || 'Fight optimization failed.');
    };
    worker.postMessage({ type: 'optimize-fight-start', config, options });
    return worker;
  }

  runOutFinderInWorker(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
    callbacks: {
      onProgress?: (progress: OutFinderProgress) => void;
      onResult?: (result: OutFinderResult) => void;
      onAborted?: (result: OutFinderResult) => void;
      onError?: (message: string) => void;
    },
    options: OutFinderOptions,
  ): Worker | null {
    const config = this.buildConfig(formGroup, count);
    if (typeof Worker === 'undefined') {
      const runner = new CalculatorBattleEngine(this.logService);
      const result = runOutFinder({
        baseConfig: config,
        options,
        simulateBatch: (batchConfig) => runner.run(batchConfig),
      });
      callbacks.onResult?.(result);
      return null;
    }
    const worker = new Worker(new URL('./simulation.worker', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (data?.type === 'out-finder-progress') callbacks.onProgress?.(data.progress as OutFinderProgress);
      else if (data?.type === 'out-finder-result') callbacks.onResult?.(data.result as OutFinderResult);
      else if (data?.type === 'out-finder-aborted') callbacks.onAborted?.(data.result as OutFinderResult);
      else if (data?.type === 'error') callbacks.onError?.(data.message || 'Out Finder failed.');
    };
    worker.onerror = (event) => callbacks.onError?.(event.message || 'Out Finder failed.');
    worker.postMessage({ type: 'out-finder-start', config, options });
    return worker;
  }

  runBoardStrengthInWorker(
    formGroup: FormGroup,
    player: Player,
    opponent: Player,
    callbacks: {
      onProgress?: (progress: BoardStrengthProgress) => void;
      onResult?: (result: BoardStrengthResult) => void;
      onAborted?: (result: BoardStrengthResult) => void;
      onError?: (message: string) => void;
    },
    options: BoardStrengthOptions,
  ): Worker | null {
    if (typeof Worker === 'undefined') {
      const result = this.runBoardStrength(
        formGroup,
        player,
        opponent,
        options,
      );
      callbacks.onResult?.(result);
      return null;
    }

    const config = this.buildConfig(formGroup, 1, {
      logsEnabled: false,
      maxLoggedBattles: 0,
    });
    const worker = new Worker(
      new URL('./simulation.worker', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = ({ data }) => {
      if (!data || !data.type) {
        return;
      }
      if (data.type === 'board-strength-progress') {
        callbacks.onProgress?.(data.progress as BoardStrengthProgress);
      } else if (data.type === 'board-strength-result') {
        callbacks.onResult?.(data.result as BoardStrengthResult);
      } else if (data.type === 'board-strength-aborted') {
        callbacks.onAborted?.(data.result as BoardStrengthResult);
      } else if (data.type === 'error') {
        callbacks.onError?.(
          data.message || 'Board strength evaluation failed.',
        );
      }
    };

    worker.onerror = (event) => {
      callbacks.onError?.(
        event.message || 'Board strength evaluation failed.',
      );
    };

    worker.postMessage({
      type: 'board-strength-start',
      config,
      options,
    });
    return worker;
  }

  requestWorkerCancel(worker: Worker | null): void {
    if (!worker) {
      return;
    }
    try {
      worker.postMessage({ type: 'cancel' });
    } catch (error) {
      // ignore
    }
  }

  runSimulation(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
    configOverrides?: Partial<SimulationConfig>,
  ): SimulationResult {
    const config = this.buildConfig(formGroup, count, configOverrides);

    const runner = new CalculatorBattleEngine(this.logService);

    const result = runner.run(config, undefined, MAX_DISPLAYED_BATTLES);

    return result;
  }

  runBoardStrength(
    formGroup: FormGroup,
    player: Player,
    opponent: Player,
    options: BoardStrengthOptions,
  ): BoardStrengthResult {
    const config = this.buildConfig(formGroup, 1, {
      logsEnabled: false,
      maxLoggedBattles: 0,
    });

    const runner = new CalculatorBattleEngine(this.logService);
    const result = runBoardStrengthEvaluation({
      baseConfig: config,
      options,
      simulateBatch: (batchConfig) => runner.run(batchConfig),
    });

    return result;
  }

  private buildConfig(
    formGroup: FormGroup,
    count: number,
    configOverrides?: Partial<SimulationConfig>,
  ): SimulationConfig {
    return buildSimulationConfigFromForm(
      formGroup,
      count,
      { maxLoggedBattles: count },
      configOverrides,
    );
  }
}
