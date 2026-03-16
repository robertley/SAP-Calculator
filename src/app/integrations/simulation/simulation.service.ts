import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimulationRunner } from 'app/gameplay/simulation-runner';
import {
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';
import { AbilityService } from '../ability/ability.service';
import { EquipmentService } from '../equipment/equipment.service';
import { GameService } from 'app/runtime/state/game.service';
import { LogService } from '../log.service';
import { PetService } from '../pet/pet.service';
import { ToyService } from '../toy/toy.service';
import { Player } from 'app/domain/entities/player.class';
import { MAX_LOGGED_BATTLES } from './simulation.constants';
import {
  PositioningOptimizationResult,
  PositioningOptimizationSide,
  PositioningOptimizerProgress,
  runPositioningOptimization,
} from './positioning-optimizer';
import {
  buildSimulationConfigFromForm,
  syncGameApiFromForm,
} from 'app/runtime/state/simulation-form-mapper';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  constructor(
    private logService: LogService,
    private gameService: GameService,
    private abilityService: AbilityService,
    private petService: PetService,
    private equipmentService: EquipmentService,
    private toyService: ToyService,
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
      const result = this.runSimulation(formGroup, count, player, opponent);
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

  runPositioningOptimizationInWorker(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
    callbacks: {
      onProgress?: (progress: PositioningOptimizerProgress) => void;
      onResult?: (result: PositioningOptimizationResult) => void;
      onAborted?: (result: PositioningOptimizationResult) => void;
      onError?: (message: string) => void;
    },
    options: {
      side: PositioningOptimizationSide;
      batchSize?: number;
      maxSimulationsPerPermutation?: number;
      confidenceZ?: number;
      minSamplesBeforeElimination?: number;
      projectEndTurnLineup?: boolean;
      keepSameBuffTargets?: boolean;
    },
    configOverrides?: Partial<SimulationConfig>,
  ): Worker | null {
    if (typeof Worker === 'undefined') {
      const result = this.runPositioningOptimization(
        formGroup,
        count,
        player,
        opponent,
        options,
        configOverrides,
      );
      callbacks.onResult?.(result);
      return null;
    }

    const config = this.buildConfig(formGroup, count, configOverrides);

    const worker = new Worker(
      new URL('./simulation.worker', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = ({ data }) => {
      if (!data || !data.type) {
        return;
      }
      if (data.type === 'positioning-progress') {
        callbacks.onProgress?.(data.progress as PositioningOptimizerProgress);
      } else if (data.type === 'positioning-result') {
        callbacks.onResult?.(data.result as PositioningOptimizationResult);
      } else if (data.type === 'positioning-aborted') {
        callbacks.onAborted?.(data.result as PositioningOptimizationResult);
      } else if (data.type === 'error') {
        callbacks.onError?.(data.message || 'Worker optimization failed.');
      }
    };

    worker.onerror = (event) => {
      callbacks.onError?.(event.message || 'Worker optimization failed.');
    };

    worker.postMessage({
      type: 'optimize-positioning-start',
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
    const wasLoggingEnabled = this.logService.isEnabled();
    const wasDeferringDecorations = this.logService.isDeferDecorations();
    this.logService.setEnabled(config.logsEnabled !== false);
    this.logService.setDeferDecorations(true);

    const runner = new SimulationRunner(
      this.logService,
      this.gameService,
      this.abilityService,
      this.petService,
      this.equipmentService,
      this.toyService,
    );

    const result = runner.run(config);

    // Restore GameService to UI players
    this.gameService.init(player, opponent);
    syncGameApiFromForm(this.gameService, formGroup);
    this.logService.setEnabled(wasLoggingEnabled);
    this.logService.setDeferDecorations(wasDeferringDecorations);

    return result;
  }

  runPositioningOptimization(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
    options: {
      side: PositioningOptimizationSide;
      batchSize?: number;
      maxSimulationsPerPermutation?: number;
      confidenceZ?: number;
      minSamplesBeforeElimination?: number;
      projectEndTurnLineup?: boolean;
      keepSameBuffTargets?: boolean;
    },
    configOverrides?: Partial<SimulationConfig>,
  ): PositioningOptimizationResult {
    const config = this.buildConfig(formGroup, count, configOverrides);
    const wasLoggingEnabled = this.logService.isEnabled();
    const wasDeferringDecorations = this.logService.isDeferDecorations();
    this.logService.setEnabled(false);
    this.logService.setDeferDecorations(true);

    const runner = new SimulationRunner(
      this.logService,
      this.gameService,
      this.abilityService,
      this.petService,
      this.equipmentService,
      this.toyService,
    );

    const result = runPositioningOptimization({
      baseConfig: config,
      options: {
        side: options.side,
        batchSize: options.batchSize,
        maxSimulationsPerPermutation: options.maxSimulationsPerPermutation,
        confidenceZ: options.confidenceZ,
        minSamplesBeforeElimination: options.minSamplesBeforeElimination,
        keepSameBuffTargets: options.keepSameBuffTargets,
      },
      projectEndTurnLineup:
        options.projectEndTurnLineup === true
          ? ({ lineup }) =>
              runner.projectLineupAfterEndTurn(config, options.side, lineup)
          : undefined,
      simulateBatch: (batchConfig) => runner.run(batchConfig),
    });

    this.gameService.init(player, opponent);
    syncGameApiFromForm(this.gameService, formGroup);

    this.logService.setEnabled(wasLoggingEnabled);
    this.logService.setDeferDecorations(wasDeferringDecorations);

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
      { maxLoggedBattles: MAX_LOGGED_BATTLES },
      configOverrides,
    );
  }
}



