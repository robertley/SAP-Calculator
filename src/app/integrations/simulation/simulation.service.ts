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
import { CustomPackConfig } from 'app/domain/interfaces/simulation-config.interface';
import {
  PositioningOptimizationResult,
  PositioningOptimizationSide,
  PositioningOptimizerProgress,
  runPositioningOptimization,
} from './positioning-optimizer';

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
    this.syncGameApiFromForm(formGroup);
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
      },
      projectEndTurnLineup: ({ lineup }) =>
        runner.projectLineupAfterEndTurn(config, options.side, lineup),
      simulateBatch: (batchConfig) => runner.run(batchConfig),
    });

    this.gameService.init(player, opponent);
    this.syncGameApiFromForm(formGroup);

    this.logService.setEnabled(wasLoggingEnabled);
    this.logService.setDeferDecorations(wasDeferringDecorations);

    return result;
  }

  private syncGameApiFromForm(formGroup: FormGroup) {
    this.gameService.gameApi.oldStork = formGroup.get('oldStork').value;
    this.gameService.gameApi.komodoShuffle =
      formGroup.get('komodoShuffle').value;
    this.gameService.gameApi.mana = formGroup.get('mana').value;
    this.gameService.gameApi.playerRollAmount =
      formGroup.get('playerRollAmount').value;
    this.gameService.gameApi.opponentRollAmount =
      formGroup.get('opponentRollAmount').value;
    this.gameService.gameApi.playerLevel3Sold =
      formGroup.get('playerLevel3Sold').value;
    this.gameService.gameApi.opponentLevel3Sold =
      formGroup.get('opponentLevel3Sold').value;
    this.gameService.gameApi.playerSummonedAmount = formGroup.get(
      'playerSummonedAmount',
    ).value;
    this.gameService.gameApi.opponentSummonedAmount = formGroup.get(
      'opponentSummonedAmount',
    ).value;
    this.gameService.gameApi.playerTransformationAmount = formGroup.get(
      'playerTransformationAmount',
    ).value;
    this.gameService.gameApi.opponentTransformationAmount = formGroup.get(
      'opponentTransformationAmount',
    ).value;
    this.gameService.setGoldSpent(
      formGroup.get('playerGoldSpent').value,
      formGroup.get('opponentGoldSpent').value,
    );
    this.gameService.setTurnNumber(formGroup.get('turn').value);
  }

  private buildConfig(
    formGroup: FormGroup,
    count: number,
    configOverrides?: Partial<SimulationConfig>,
  ): SimulationConfig {
    const logsEnabled = formGroup.get('logsEnabled')?.value ?? true;
    const rawSeed = formGroup.get('seed')?.value;
    const parsedSeed = Number(rawSeed);
    const seed =
      rawSeed === '' || rawSeed == null || !Number.isFinite(parsedSeed)
        ? null
        : Math.trunc(parsedSeed);
    return {
      playerPack: formGroup.get('playerPack').value,
      opponentPack: formGroup.get('opponentPack').value,
      playerToy: formGroup.get('playerToy').value,
      playerToyLevel: formGroup.get('playerToyLevel').value,
      playerHardToy: formGroup.get('playerHardToy').value,
      playerHardToyLevel: formGroup.get('playerHardToyLevel').value,
      opponentToy: formGroup.get('opponentToy').value,
      opponentToyLevel: formGroup.get('opponentToyLevel').value,
      opponentHardToy: formGroup.get('opponentHardToy').value,
      opponentHardToyLevel: formGroup.get('opponentHardToyLevel').value,
      turn: formGroup.get('turn').value,
      playerGoldSpent: formGroup.get('playerGoldSpent').value,
      opponentGoldSpent: formGroup.get('opponentGoldSpent').value,
      playerRollAmount: formGroup.get('playerRollAmount').value,
      opponentRollAmount: formGroup.get('opponentRollAmount').value,
      playerSummonedAmount: formGroup.get('playerSummonedAmount').value,
      opponentSummonedAmount: formGroup.get('opponentSummonedAmount').value,
      playerLevel3Sold: formGroup.get('playerLevel3Sold').value,
      opponentLevel3Sold: formGroup.get('opponentLevel3Sold').value,
      playerTransformationAmount: formGroup.get('playerTransformationAmount')
        .value,
      opponentTransformationAmount: formGroup.get(
        'opponentTransformationAmount',
      ).value,
      playerPets: this.normalizePetList(formGroup.get('playerPets').value),
      opponentPets: this.normalizePetList(formGroup.get('opponentPets').value),
      customPacks: this.normalizeCustomPacks(
        formGroup.get('customPacks')?.value,
      ),
      allPets: formGroup.get('allPets').value,
      oldStork: formGroup.get('oldStork').value,
      tokenPets: formGroup.get('tokenPets').value,
      komodoShuffle: formGroup.get('komodoShuffle').value,
      mana: formGroup.get('mana').value,
      seed,
      simulationCount: count,
      logsEnabled,
      maxLoggedBattles: MAX_LOGGED_BATTLES,
      ...configOverrides,
    };
  }

  private normalizeCustomPacks(customPacks: unknown): CustomPackConfig[] {
    if (!Array.isArray(customPacks)) {
      return [];
    }

    return customPacks
      .map((customPack) => this.normalizeCustomPack(customPack))
      .filter((customPack): customPack is CustomPackConfig => customPack !== null);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private normalizeCustomPack(customPack: unknown): CustomPackConfig | null {
    if (!this.isRecord(customPack)) {
      return null;
    }
    const name = `${customPack.name ?? ''}`.trim();
    if (!name) {
      return null;
    }

    const normalizeTierList = (value: unknown): string[] => {
      if (!Array.isArray(value)) {
        return [];
      }
      return value
        .filter((entry): entry is string => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    };

    return {
      name,
      tier1Pets: normalizeTierList(customPack.tier1Pets),
      tier2Pets: normalizeTierList(customPack.tier2Pets),
      tier3Pets: normalizeTierList(customPack.tier3Pets),
      tier4Pets: normalizeTierList(customPack.tier4Pets),
      tier5Pets: normalizeTierList(customPack.tier5Pets),
      tier6Pets: normalizeTierList(customPack.tier6Pets),
      spells: normalizeTierList(customPack.spells),
    };
  }

  private normalizePetList(
    pets: unknown,
  ): (SimulationConfig['playerPets'][number] | null)[] {
    if (!Array.isArray(pets)) {
      return [];
    }
    return pets.map((pet) => this.normalizePetEntry(pet));
  }

  private normalizePetEntry(
    pet: unknown,
  ): SimulationConfig['playerPets'][number] | null {
    if (!this.isRecord(pet) || typeof pet.name !== 'string' || !pet.name) {
      return null;
    }

    const normalized: Record<string, unknown> = { ...pet };
    const rawEquipment = normalized.equipment;
    let equipmentName: string | null = null;
    let equipmentUses: number | null =
      typeof normalized.equipmentUses === 'number'
        ? normalized.equipmentUses
        : null;

    if (this.isRecord(rawEquipment)) {
      equipmentName =
        typeof rawEquipment.name === 'string' ? rawEquipment.name : null;
      if (equipmentUses == null && rawEquipment.uses != null) {
        const usesValue = Number(rawEquipment.uses);
        equipmentUses = Number.isFinite(usesValue) ? usesValue : null;
      }
    } else if (typeof rawEquipment === 'string') {
      equipmentName = rawEquipment;
    }

    normalized.equipment = equipmentName ? { name: equipmentName } : null;
    normalized.equipmentUses = equipmentUses ?? null;

    delete normalized.parent;
    delete normalized.logService;
    delete normalized.abilityService;
    delete normalized.gameService;
    delete normalized.petService;
    delete normalized.abilityList;
    delete normalized.originalAbilityList;
    delete normalized.originalEquipment;

    return normalized as unknown as SimulationConfig['playerPets'][number];
  }

}


