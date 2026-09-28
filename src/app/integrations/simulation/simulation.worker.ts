/// <reference lib="webworker" />

import {
  SimulationConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import { LogService } from '../log.service';
import { CalculatorBattleEngine } from './battle-engine';
import { runPositioningOptimization } from './positioning-optimizer';
import { OutFinderOptions, runOutFinder } from './out-finder';
import {
  BoardStrengthOptions,
  runBoardStrengthEvaluation,
} from './board-strength-evaluator';
import {
  FightOptimizerOptions,
  optimizeFight,
} from 'sap-battle-engine';
import { MAX_DISPLAYED_BATTLES } from './simulation.constants';

type StartMessage = {
  type: 'start';
  config: SimulationConfig;
  progressInterval?: number;
  showTriggerNamesInLogs?: boolean;
};
type OptimizePositioningStartMessage = {
  type: 'optimize-positioning-start';
  config: SimulationConfig;
  options: {
    side: 'player' | 'opponent';
    batchSize?: number;
    maxSimulationsPerPermutation?: number;
    confidenceZ?: number;
    minSamplesBeforeElimination?: number;
    projectEndTurnLineup?: boolean;
    keepSameBuffTargets?: boolean;
    recomputeParrotCopies?: boolean;
    successiveHalving?: boolean;
    successiveHalvingRate?: number;
  };
};
type OptimizeFightStartMessage = {
  type: 'optimize-fight-start';
  config: SimulationConfig;
  options: Pick<
    FightOptimizerOptions,
    | 'seed'
    | 'initialSimulations'
    | 'refinementSimulations'
    | 'collectAllBestResponses'
    | 'maxSimulations'
    | 'maxResponseSteps'
  >;
};

type BoardStrengthStartMessage = {
  type: 'board-strength-start';
  config: SimulationConfig;
  options: BoardStrengthOptions;
};
type OutFinderStartMessage = {
  type: 'out-finder-start';
  config: SimulationConfig;
  options: OutFinderOptions;
};

type CancelMessage = { type: 'cancel' };

type IncomingMessage =
  | StartMessage
  | OptimizeFightStartMessage
  | OptimizePositioningStartMessage
  | OutFinderStartMessage
  | BoardStrengthStartMessage
  | CancelMessage;

let cancelRequested = false;

const createRunner = () => {
  const logService = new LogService();
  return { runner: new CalculatorBattleEngine(logService), logService };
};

let workerRuntime: ReturnType<typeof createRunner> | null = null;

const getRunner = () => {
  workerRuntime ??= createRunner();
  return workerRuntime;
};

addEventListener('message', ({ data }: MessageEvent<IncomingMessage>) => {
  if (!data) {
    return;
  }

  if (data.type === 'cancel') {
    cancelRequested = true;
    return;
  }

  if (data.type === 'optimize-fight-start') {
    cancelRequested = false;
    const { config, options } = data;
    try {
      const result = optimizeFight(config, {
        ...options,
        shouldAbort: () => cancelRequested,
        onProgress: (progress) => {
          postMessage({ type: 'fight-optimizer-progress', progress });
        },
      });
      postMessage({
        type:
          result.termination === 'cancelled'
            ? 'fight-optimizer-aborted'
            : 'fight-optimizer-result',
        result,
      });
    } catch (error) {
      postMessage({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Fight optimization failed.',
      });
    }
    return;
  }

  if (data.type === 'board-strength-start') {
    cancelRequested = false;
    const { config, options } = data;

    try {
      const { runner } = getRunner();
      const result = runBoardStrengthEvaluation({
        baseConfig: config,
        options,
        shouldAbort: () => cancelRequested,
        onProgress: (progress) => {
          postMessage({ type: 'board-strength-progress', progress });
        },
        simulateBatch: (batchConfig) =>
          runner.run(batchConfig, {
            shouldAbort: () => cancelRequested,
          }),
      });

      if (cancelRequested || result.aborted) {
        postMessage({ type: 'board-strength-aborted', result });
      } else {
        postMessage({ type: 'board-strength-result', result });
      }
    } catch (error) {
      postMessage({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Board strength evaluation failed.',
      });
    }
    return;
  }

  if (data.type === 'out-finder-start') {
    cancelRequested = false;
    const { config, options } = data;
    try {
      const { runner } = getRunner();
      const result = runOutFinder({
        baseConfig: config,
        options,
        shouldAbort: () => cancelRequested,
        onProgress: (progress) => postMessage({ type: 'out-finder-progress', progress }),
        simulateBatch: (batchConfig) =>
          runner.run(batchConfig, { shouldAbort: () => cancelRequested }),
      });
      postMessage({
        type: cancelRequested || result.aborted ? 'out-finder-aborted' : 'out-finder-result',
        result,
      });
    } catch (error) {
      postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Out Finder failed.',
      });
    }
    return;
  }

  if (data.type !== 'start') {
    if (data.type !== 'optimize-positioning-start') {
      return;
    }

    cancelRequested = false;
    const { config, options } = data;

    try {
      const { runner } = getRunner();
      const result = runPositioningOptimization({
        baseConfig: config,
        options: {
          side: options.side,
          batchSize: options.batchSize,
          maxSimulationsPerPermutation: options.maxSimulationsPerPermutation,
          confidenceZ: options.confidenceZ,
          minSamplesBeforeElimination: options.minSamplesBeforeElimination,
          keepSameBuffTargets: options.keepSameBuffTargets,
          recomputeParrotCopies: options.recomputeParrotCopies,
          successiveHalving: options.successiveHalving,
          successiveHalvingRate: options.successiveHalvingRate,
        },
        shouldAbort: () => cancelRequested,
        onProgress: (progress) => {
          postMessage({ type: 'positioning-progress', progress });
        },
        projectEndTurnLineup:
          options.projectEndTurnLineup === true
            ? ({ lineup }) =>
                runner.projectLineupAfterEndTurn(config, options.side, lineup)
            : undefined,
        simulateBatch: (batchConfig) =>
          runner.run(batchConfig, {
            shouldAbort: () => cancelRequested,
          }),
      });

      if (cancelRequested || result.aborted) {
        postMessage({ type: 'positioning-aborted', result });
      } else {
        postMessage({ type: 'positioning-result', result });
      }
    } catch (error) {
      postMessage({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Worker optimization failed.',
      });
    }
    return;
  }

  cancelRequested = false;
  const { config, progressInterval, showTriggerNamesInLogs } = data;

  try {
    const { runner, logService } = getRunner();
    logService.setShowTriggerNamesInLogs(Boolean(showTriggerNamesInLogs));

    const result = runner.run(
      config,
      {
        progressInterval: progressInterval ?? 50,
        shouldAbort: () => cancelRequested,
        onProgress: (progress) => {
          postMessage({ type: 'progress', ...progress });
        },
      },
      MAX_DISPLAYED_BATTLES,
    );

    if (cancelRequested) {
      postMessage({ type: 'aborted', result: result });
    } else {
      postMessage({ type: 'result', result: result });
    }
  } catch (error) {
    postMessage({
      type: 'error',
      message:
        error instanceof Error ? error.message : 'Worker simulation failed.',
    });
  }
});
