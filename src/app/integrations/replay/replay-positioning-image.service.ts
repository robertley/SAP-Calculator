import { Injectable } from '@angular/core';
import { ReplayCalcService } from './replay-calc.service';
import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalculatorState,
  buildReplayAbilityPetMapFromActions,
} from './replay-calc-parser';
import { SimulationRunner } from 'app/gameplay/simulation-runner';
import {
  PetConfig,
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';
import { LogService } from '../log.service';
import { GameService } from 'app/runtime/state/game.service';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityService } from '../ability/ability.service';
import { PetService } from '../pet/pet.service';
import { EquipmentService } from '../equipment/equipment.service';
import { ToyService } from '../toy/toy.service';
import {
  PositioningOptimizerProgress,
  PositioningOptimizationResult,
  PositioningOptimizationPrecision,
  getPositioningSimulationCount,
  runPositioningOptimization,
} from '../simulation/positioning-optimizer';
import {
  getEquipmentIconPath,
  getPetIconPath,
  getToyIconPath,
} from 'app/runtime/asset-catalog';
import {
  ReplayImageBattleInfo,
  ReplayImageCanvasRendererService,
  ReplayImagePetInfo,
  ReplayImageToyInfo,
} from './replay-image-canvas-renderer.service';
import {
  getReplayImageCalculatorState,
  mergeReplayImageCalculatorState,
} from './replay-image-calculator-state';

export interface ReplayPositioningImageBuildInput {
  replayPayload: Record<string, unknown>;
  precision?: PositioningOptimizationPrecision;
  optimizationSide: 'player' | 'opponent';
  projectEndTurnEffects?: boolean;
  recomputeParrotCopies?: boolean;
  abilityPetMap?: Record<string, string | number> | null;
  abortSignal?: AbortSignal;
  onProgress?: (progress: ReplayPositioningImageProgress) => void;
}

export interface ReplayPositioningImageProgress {
  percent: number;
  message: string;
  phase: 'preparing' | 'optimizing' | 'rendering';
  currentTurn: number;
  totalTurns: number;
}

export interface ReplayPositioningImageHotspot {
  turn: number;
  calculatorUrl: string;
  top: number;
  height: number;
}

export interface ReplayPositioningImagePreview {
  width: number;
  height: number;
  hotspots: ReplayPositioningImageHotspot[];
}

export interface ReplayPositioningImageResult {
  blob: Blob;
  preview: ReplayPositioningImagePreview;
}

export function getOptimizedPositioningLineup(
  result: PositioningOptimizationResult,
): (PetConfig | null)[] {
  return result.bestPermutation.simulationLineup.length > 0
    ? result.bestPermutation.simulationLineup
    : result.bestPermutation.lineup;
}

function clonePetConfig(pet: PetConfig | null): PetConfig | null {
  if (!pet) {
    return null;
  }
  return {
    ...pet,
    equipment: pet.equipment ? { ...pet.equipment } : null,
  };
}

export function buildOptimizedPositioningCalculatorState(
  calculatorState: ReplayCalculatorState,
  result: PositioningOptimizationResult,
): ReplayCalculatorState {
  const optimizedLineup = getOptimizedPositioningLineup(result);
  return {
    ...calculatorState,
    playerPets: clonePetConfigLineup(
      result.side === 'player' ? optimizedLineup : calculatorState.playerPets,
    ),
    opponentPets: clonePetConfigLineup(
      result.side === 'opponent'
        ? optimizedLineup
        : calculatorState.opponentPets,
    ),
  };
}

function clonePetConfigLineup(
  lineup: (PetConfig | null)[] | null | undefined,
): (PetConfig | null)[] {
  return (lineup ?? []).map((pet) => clonePetConfig(pet));
}

interface ReplayActionEntry {
  Type?: number;
  Turn?: number | string | null;
  Battle?: string;
}

interface OddsSummary {
  win: number;
  draw: number;
  loss: number;
}

interface TurnDeltaSummary {
  baseline: OddsSummary;
  optimized: OddsSummary;
  deltaWin: number;
  deltaDraw: number;
  deltaLoss: number;
}

interface OptimizedTurnRow {
  turn: number;
  renderInfo: RenderBattleInfo;
  delta: TurnDeltaSummary;
  calculatorUrl: string;
}

type RenderPetInfo = ReplayImagePetInfo;
type RenderToyInfo = ReplayImageToyInfo;
type RenderBattleInfo = ReplayImageBattleInfo;

@Injectable({
  providedIn: 'root',
})
export class ReplayPositioningImageService {
  constructor(
    private replayCalcService: ReplayCalcService,
    private logService: LogService,
    private gameService: GameService,
    private abilityService: AbilityService,
    private petService: PetService,
    private equipmentService: EquipmentService,
    private toyService: ToyService,
    private replayImageRenderer: ReplayImageCanvasRendererService,
  ) {}

  async buildPositioningImage(
    input: ReplayPositioningImageBuildInput,
  ): Promise<ReplayPositioningImageResult> {
    this.throwIfAborted(input.abortSignal);
    this.emitProgress(input, 0, 'Preparing replay turns...', 'preparing', 0, 0);
    const resolvedReplay = this.resolveReplayActionsContainer(input.replayPayload);
    const turnRows = this.extractBattleRows(resolvedReplay);
    if (turnRows.length === 0) {
      throw new Error('Replay JSON did not contain battle turns.');
    }
    this.emitProgress(input, 3, 'Parsed replay turns.', 'preparing', 0, turnRows.length);

    const replayActions = this.getReplayActions(resolvedReplay);
    const abilityPetMap =
      input.abilityPetMap ??
      this.getReplayAbilityPetMap(resolvedReplay) ??
      (replayActions ? buildReplayAbilityPetMapFromActions(replayActions) : null);
    const buildModel = this.getReplayBuildModel(resolvedReplay);

    const optimizedRows: OptimizedTurnRow[] = [];
    const totalTurns = turnRows.length;
    for (let turnIndex = 0; turnIndex < turnRows.length; turnIndex += 1) {
      const row = turnRows[turnIndex];
      this.throwIfAborted(input.abortSignal);
      this.emitProgress(
        input,
        this.computeOverallProgress(turnIndex, totalTurns, 0),
        `Preparing turn ${turnIndex + 1}/${totalTurns}...`,
        'optimizing',
        turnIndex + 1,
        totalTurns,
      );
      const parsedCalculatorState =
        this.replayCalcService.parseReplayForCalculator(
          row.battle,
          buildModel ?? undefined,
          undefined,
          { abilityPetMap },
        );
      const calculatorState = mergeReplayImageCalculatorState(
        parsedCalculatorState,
        getReplayImageCalculatorState(resolvedReplay, row.turn),
      );
      const optimizationLineup =
        input.optimizationSide === 'player'
          ? calculatorState.playerPets
          : calculatorState.opponentPets;
      const simulationCount = getPositioningSimulationCount(
        optimizationLineup,
        input.precision ?? 'quick',
      );
      const previousOutcome =
        turnIndex > 0
          ? this.getBattleOutcome(turnRows[turnIndex - 1].battle)
          : null;
      const baseConfig: SimulationConfig = {
        ...this.createSimulationConfigFromCalculatorState(
          calculatorState,
          simulationCount,
        ),
        playerLostLastBattle: previousOutcome === 2,
        opponentLostLastBattle: previousOutcome === 1,
      };
      const baselineResult = this.runLocalSimulation(baseConfig);
      const optimizationResult = await this.runOptimization(
        baseConfig,
        simulationCount,
        input.optimizationSide,
        input.projectEndTurnEffects !== false,
        input.recomputeParrotCopies !== false,
        input.abortSignal,
        (turnPercent) => {
          this.emitProgress(
            input,
            this.computeOverallProgress(turnIndex, totalTurns, turnPercent),
            `Optimizing turn ${turnIndex + 1}/${totalTurns} (${Math.round(turnPercent)}%)`,
            'optimizing',
            turnIndex + 1,
            totalTurns,
          );
        },
      );
      this.throwIfAborted(input.abortSignal);
      const linkedCalculatorState =
        buildOptimizedPositioningCalculatorState(
          calculatorState,
          optimizationResult,
        );
      const optimizedConfig: SimulationConfig = {
        ...this.createSimulationConfigFromCalculatorState(
          linkedCalculatorState,
          simulationCount,
        ),
        playerLostLastBattle: previousOutcome === 2,
        opponentLostLastBattle: previousOutcome === 1,
      };
      const optimizedResult = this.runLocalSimulation(optimizedConfig);
      this.throwIfAborted(input.abortSignal);
      const calculatorUrl =
        this.replayCalcService.generateCalculatorLink(linkedCalculatorState);

      const delta = this.buildDeltaSummary(
        baselineResult,
        optimizedResult,
        input.optimizationSide,
      );

      optimizedRows.push({
        turn: row.turn,
        renderInfo: this.toRenderBattleInfo(
          row.battle,
          linkedCalculatorState,
        ),
        delta,
        calculatorUrl,
      });
      this.emitProgress(
        input,
        this.computeOverallProgress(turnIndex + 1, totalTurns, 0),
        `Completed turn ${turnIndex + 1}/${totalTurns}.`,
        'optimizing',
        turnIndex + 1,
        totalTurns,
      );
    }

    this.emitProgress(input, 98, 'Rendering image...', 'rendering', totalTurns, totalTurns);
    return this.renderPositioningImage(
      optimizedRows,
      input.precision ?? 'quick',
      input.optimizationSide,
    );
  }

  async buildPositioningImageBlob(
    input: ReplayPositioningImageBuildInput,
  ): Promise<Blob> {
    const result = await this.buildPositioningImage(input);
    return result.blob;
  }

  private runOptimization(
    baseConfig: SimulationConfig,
    simulationCount: number,
    optimizationSide: 'player' | 'opponent',
    projectEndTurnEffects: boolean,
    recomputeParrotCopies: boolean,
    abortSignal?: AbortSignal,
    onProgress?: (percent: number) => void,
  ): Promise<PositioningOptimizationResult> {
    if (typeof Worker !== 'undefined') {
      return this.runOptimizationInWorker(
        baseConfig,
        simulationCount,
        optimizationSide,
        projectEndTurnEffects,
        recomputeParrotCopies,
        abortSignal,
        onProgress,
      );
    }

    return Promise.resolve(
      runPositioningOptimization({
        baseConfig: {
          ...baseConfig,
          simulationCount,
        },
        options: {
          side: optimizationSide,
          maxSimulationsPerPermutation: simulationCount,
          batchSize: Math.min(25, simulationCount),
          minSamplesBeforeElimination: Math.min(50, simulationCount),
          confidenceZ: 1.96,
          keepSameBuffTargets: !projectEndTurnEffects,
          recomputeParrotCopies,
        },
        shouldAbort: () => Boolean(abortSignal?.aborted),
        onProgress: (progress) => {
          if (progress.totalBattlesEstimate <= 0) {
            return;
          }
          const percent = Math.min(
            100,
            Math.max(
              0,
              (progress.completedBattles / progress.totalBattlesEstimate) * 100,
            ),
          );
          onProgress?.(percent);
        },
        projectEndTurnLineup: projectEndTurnEffects
          ? ({ baseConfig: projectionConfig, side, lineup }) => {
              const runner = new SimulationRunner(
                this.logService,
                this.gameService,
                this.abilityService,
                this.petService,
                this.equipmentService,
                this.toyService,
              );
              return runner.projectLineupAfterEndTurn(
                projectionConfig,
                side,
                lineup,
              );
            }
          : undefined,
        simulateBatch: (config) => this.runLocalSimulation(config),
      }),
    );
  }

  private runOptimizationInWorker(
    baseConfig: SimulationConfig,
    simulationCount: number,
    optimizationSide: 'player' | 'opponent',
    projectEndTurnEffects: boolean,
    recomputeParrotCopies: boolean,
    abortSignal?: AbortSignal,
    onProgress?: (percent: number) => void,
  ): Promise<PositioningOptimizationResult> {
    return new Promise<PositioningOptimizationResult>((resolve, reject) => {
      const worker = new Worker(
        new URL('../simulation/simulation.worker', import.meta.url),
        { type: 'module' },
      );

      let settled = false;
      const cleanup = () => {
        worker.terminate();
        abortSignal?.removeEventListener('abort', abortListener);
      };
      const finishResolve = (value: PositioningOptimizationResult) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        resolve(value);
      };
      const finishReject = (error: Error) => {
        if (settled) {
          return;
        }
        settled = true;
        cleanup();
        reject(error);
      };

      const abortListener = () => {
        try {
          worker.postMessage({ type: 'cancel' });
        } catch {
          // ignore
        }
        finishReject(new Error('Positioning image build cancelled.'));
      };
      if (abortSignal?.aborted) {
        finishReject(new Error('Positioning image build cancelled.'));
        return;
      }
      abortSignal?.addEventListener('abort', abortListener, { once: true });

      worker.onmessage = ({ data }) => {
        if (!data || !data.type) {
          return;
        }
        if (data.type === 'positioning-progress') {
          const progress = data.progress as PositioningOptimizerProgress;
          if (progress.totalBattlesEstimate > 0) {
            const percent = Math.min(
              100,
              Math.max(
                0,
                (progress.completedBattles / progress.totalBattlesEstimate) * 100,
              ),
            );
            onProgress?.(percent);
          }
          return;
        }
        if (data.type === 'positioning-result') {
          finishResolve(data.result as PositioningOptimizationResult);
          return;
        }
        if (data.type === 'positioning-aborted') {
          finishReject(new Error('Positioning image build cancelled.'));
          return;
        }
        if (data.type === 'error') {
          finishReject(new Error(data.message || 'Worker optimization failed.'));
        }
      };

      worker.onerror = (event) => {
        finishReject(new Error(event.message || 'Worker optimization failed.'));
      };

      worker.postMessage({
        type: 'optimize-positioning-start',
        config: {
          ...baseConfig,
          simulationCount,
        },
        options: {
          side: optimizationSide,
          maxSimulationsPerPermutation: simulationCount,
          batchSize: Math.min(25, simulationCount),
          minSamplesBeforeElimination: Math.min(50, simulationCount),
          confidenceZ: 1.96,
          projectEndTurnLineup: projectEndTurnEffects,
          keepSameBuffTargets: !projectEndTurnEffects,
          recomputeParrotCopies,
        },
      });
    });
  }

  private buildDeltaSummary(
    baselineResult: SimulationResult,
    optimizedResult: SimulationResult,
    side: 'player' | 'opponent',
  ): TurnDeltaSummary {
    const baseline = this.toOddsSummary(baselineResult, side);
    const optimized = this.toOddsSummary(optimizedResult, side);
    return {
      baseline,
      optimized,
      deltaWin: optimized.win - baseline.win,
      deltaDraw: optimized.draw - baseline.draw,
      deltaLoss: optimized.loss - baseline.loss,
    };
  }

  private toOddsSummary(
    result: SimulationResult,
    side: 'player' | 'opponent',
  ): OddsSummary {
    const total = result.playerWins + result.opponentWins + result.draws;
    if (total <= 0) {
      return { win: 0, draw: 0, loss: 0 };
    }
    const sideWins = side === 'player' ? result.playerWins : result.opponentWins;
    const sideLosses = side === 'player' ? result.opponentWins : result.playerWins;
    return {
      win: (sideWins / total) * 100,
      draw: (result.draws / total) * 100,
      loss: (sideLosses / total) * 100,
    };
  }

  private buildRenderPetsFromPetConfigLineup(
    lineup: (PetConfig | null)[],
  ): Array<RenderPetInfo | null> {
    return lineup.map((pet) => {
      if (!pet?.name) {
        return null;
      }
      const equipmentName = pet?.equipment?.name ?? null;
      return {
        imagePath: getPetIconPath(pet.name),
        perkImagePath: equipmentName
          ? getEquipmentIconPath(equipmentName)
          : null,
        attack: this.toNumberOrFallback(pet.attack, 0),
        health: this.toNumberOrFallback(pet.health, 0),
        level: this.toNumberOrFallback(pet.exp, 1) >= 5 ? 3 : this.toNumberOrFallback(pet.exp, 1) >= 2 ? 2 : 1,
        xp: this.toNumberOrFallback(pet.exp, 0),
      };
    });
  }

  private async renderPositioningImage(
    rows: OptimizedTurnRow[],
    precision: PositioningOptimizationPrecision,
    optimizationSide: 'player' | 'opponent',
  ): Promise<ReplayPositioningImageResult> {
    const DELTA_COLUMN_WIDTH = 360;
    const title =
      rows[0]?.renderInfo.playerName && rows[0]?.renderInfo.opponentName
        ? `${rows[0].renderInfo.playerName} vs ${rows[0].renderInfo.opponentName} (Optimized Positioning)`
        : null;
    const session = this.replayImageRenderer.createSession({
      rowCount: rows.length,
      extraColumnWidth: DELTA_COLUMN_WIDTH,
      title,
    });
    const { ctx } = session;

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];

      const { baseY } = await this.replayImageRenderer.drawBattleRow(session, {
        index: i,
        turn: row.turn,
        info: row.renderInfo,
      });

      const deltaX = session.baseWidth + 10;
      const delta = row.delta;
      if (this.hasVisibleOddsChange(delta)) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#137333';
        ctx.font = 'bold 15px Arial';
        ctx.fillText(
          `Win ${delta.baseline.win.toFixed(1)}% -> ${delta.optimized.win.toFixed(1)}% (${this.formatDelta(delta.deltaWin)}%)`,
          deltaX,
          baseY + 8,
        );
        ctx.fillStyle = '#000000';
        ctx.font = '15px Arial';
        ctx.fillText(
          `Draw ${delta.baseline.draw.toFixed(1)}% -> ${delta.optimized.draw.toFixed(1)}% (${this.formatDelta(delta.deltaDraw)}%)`,
          deltaX,
          baseY + 28,
        );
        ctx.fillStyle = '#B00020';
        ctx.font = '15px Arial';
        ctx.fillText(
          `Loss ${delta.baseline.loss.toFixed(1)}% -> ${delta.optimized.loss.toFixed(1)}% (${this.formatDelta(delta.deltaLoss)}%)`,
          deltaX,
          baseY + 48,
        );
      }
      ctx.textAlign = 'center';
    }

    const footerY = this.replayImageRenderer.drawFooterBackground(session);
    const totalWinDelta = rows.reduce((sum, row) => sum + row.delta.deltaWin, 0);
    const totalLossDelta = rows.reduce((sum, row) => sum + row.delta.deltaLoss, 0);
    const totalDrawDelta = rows.reduce((sum, row) => sum + row.delta.deltaDraw, 0);
    ctx.fillStyle = '#111111';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Precision: ${precision === 'extended' ? 'Extended' : 'Quick'} (dynamic simulations) | Optimization side: ${optimizationSide}`,
      25,
      footerY + 24,
    );
    ctx.fillText(
      `Total optimize delta across turns: Win ${this.formatDelta(totalWinDelta)}% | Loss ${this.formatDelta(totalLossDelta)}% | Draw ${this.formatDelta(totalDrawDelta)}%`,
      25,
      footerY + 44,
    );

    const preview: ReplayPositioningImagePreview = {
      width: session.width,
      height: session.height,
      hotspots: rows.map((row, index) => ({
        turn: row.turn,
        calculatorUrl: row.calculatorUrl,
        top: session.headerHeight + index * session.rowHeight,
        height: session.rowHeight,
      })),
    };

    return {
      blob: await this.replayImageRenderer.toBlob(session),
      preview,
    };
  }

  private formatDelta(value: number): string {
    const fixed = value.toFixed(1);
    return value > 0 ? `+${fixed}` : fixed;
  }

  private hasVisibleOddsChange(delta: TurnDeltaSummary): boolean {
    const round = (value: number) => Math.round(value * 10) / 10;
    return (
      round(delta.baseline.win) !== round(delta.optimized.win) ||
      round(delta.baseline.draw) !== round(delta.optimized.draw) ||
      round(delta.baseline.loss) !== round(delta.optimized.loss)
    );
  }

  private runLocalSimulation(config: SimulationConfig): SimulationResult {
    const previousGameApi = this.gameService.gameApi
      ? ({ ...this.gameService.gameApi } as GameAPI)
      : null;
    const wasEnabled = this.logService.isEnabled();
    const wasDeferDecorations = this.logService.isDeferDecorations();
    const wasShowTriggerNames = this.logService.isShowTriggerNamesInLogs();

    const runner = new SimulationRunner(
      this.logService,
      this.gameService,
      this.abilityService,
      this.petService,
      this.equipmentService,
      this.toyService,
    );

    try {
      return runner.run(config);
    } finally {
      if (previousGameApi) {
        this.gameService.gameApi = previousGameApi;
      }
      this.logService.setEnabled(wasEnabled);
      this.logService.setDeferDecorations(wasDeferDecorations);
      this.logService.setShowTriggerNamesInLogs(wasShowTriggerNames);
    }
  }

  private createSimulationConfigFromCalculatorState(
    calculatorState: ReplayCalculatorState,
    simulationCount: number,
  ): SimulationConfig {
    return {
      playerPack: calculatorState.playerPack,
      opponentPack: calculatorState.opponentPack,
      playerToy: calculatorState.playerToy,
      playerToyLevel: this.toNumberOrFallback(calculatorState.playerToyLevel, 1),
      playerHardToy: calculatorState.playerHardToy,
      playerHardToyLevel: calculatorState.playerHardToyLevel,
      opponentToy: calculatorState.opponentToy,
      opponentToyLevel: this.toNumberOrFallback(calculatorState.opponentToyLevel, 1),
      opponentHardToy: calculatorState.opponentHardToy,
      opponentHardToyLevel: calculatorState.opponentHardToyLevel,
      turn: calculatorState.turn,
      playerGoldSpent: calculatorState.playerGoldSpent,
      opponentGoldSpent: calculatorState.opponentGoldSpent,
      playerRollAmount: calculatorState.playerRollAmount,
      opponentRollAmount: calculatorState.opponentRollAmount,
      playerSummonedAmount: calculatorState.playerSummonedAmount,
      opponentSummonedAmount: calculatorState.opponentSummonedAmount,
      playerLevel3Sold: calculatorState.playerLevel3Sold,
      opponentLevel3Sold: calculatorState.opponentLevel3Sold,
      playerTransformationAmount: calculatorState.playerTransformationAmount,
      opponentTransformationAmount: calculatorState.opponentTransformationAmount,
      playerPets: calculatorState.playerPets,
      opponentPets: calculatorState.opponentPets,
      customPacks: calculatorState.customPacks,
      allPets: calculatorState.allPets,
      oldStork: calculatorState.oldStork,
      tokenPets: calculatorState.tokenPets,
      komodoShuffle: calculatorState.komodoShuffle,
      mana: calculatorState.mana,
      seed: calculatorState.seed,
      simulationCount,
      logsEnabled: false,
      maxLoggedBattles: 0,
    };
  }

  private resolveReplayActionsContainer(
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const rootRawJson = this.getRecord(payload, 'raw_json');
    if (rootRawJson && Array.isArray(rootRawJson['Actions'])) {
      return rootRawJson;
    }

    const nestedReplay = this.getRecord(payload, 'replay');
    const nestedRawJson = nestedReplay ? this.getRecord(nestedReplay, 'raw_json') : null;
    if (nestedRawJson && Array.isArray(nestedRawJson['Actions'])) {
      return nestedRawJson;
    }

    return payload;
  }

  private extractBattleRows(
    replayPayload: Record<string, unknown>,
  ): Array<{ turn: number; battle: ReplayBattleJson }> {
    const actions = this.getReplayActions(replayPayload);
    if (!actions || actions.length === 0) {
      return [];
    }
    let fallbackTurn = 1;
    return actions
      .map((action) => {
        const actionType = this.toNumberOrFallback(action?.Type, 0);
        if ((actionType !== 0 && actionType !== 1) || typeof action.Battle !== 'string') {
          return null;
        }
        const parsedBattle = this.safeParseBattleJson(action.Battle);
        if (!parsedBattle) {
          return null;
        }
        const parsedTurn = this.toPositiveInt(action.Turn);
        const row = { turn: parsedTurn ?? fallbackTurn, battle: parsedBattle };
        fallbackTurn += 1;
        return row;
      })
      .filter((row): row is { turn: number; battle: ReplayBattleJson } => row !== null);
  }

  private toRenderBattleInfo(
    battle: ReplayBattleJson,
    calculatorState: ReplayCalculatorState,
  ): RenderBattleInfo {
    const userBoard = this.getBoard(battle, 'UserBoard');
    const opponentBoard = this.getBoard(battle, 'OpponentBoard');
    return {
      outcome: this.getBattleOutcome(battle),
      playerName: this.getDisplayName(battle, 'User'),
      opponentName: this.getDisplayName(battle, 'Opponent'),
      playerLives: this.getBoardLives(userBoard),
      opponentLives: this.getBoardLives(opponentBoard),
      playerPets: this.buildRenderPetsFromPetConfigLineup(
        calculatorState.playerPets,
      ),
      opponentPets: this.buildRenderPetsFromPetConfigLineup(
        calculatorState.opponentPets,
      ),
      playerToy: this.toRenderToy(
        calculatorState.playerToy,
        calculatorState.playerToyLevel,
      ),
      opponentToy: this.toRenderToy(
        calculatorState.opponentToy,
        calculatorState.opponentToyLevel,
      ),
    };
  }

  private toRenderToy(
    name: string | null,
    level: unknown,
  ): RenderToyInfo | null {
    if (!name) {
      return null;
    }
    return {
      imagePath: getToyIconPath(name),
      level: this.toNumberOrFallback(level, 1),
    };
  }

  private getReplayActions(payload: Record<string, unknown>): ReplayActionEntry[] | null {
    const actions = payload['Actions'];
    return Array.isArray(actions) ? (actions as ReplayActionEntry[]) : null;
  }

  private getReplayBuildModel(payload: Record<string, unknown>): ReplayBuildModelJson | null {
    const build = payload['GenesisBuildModel'];
    return this.isObject(build) ? (build as ReplayBuildModelJson) : null;
  }

  private getReplayAbilityPetMap(
    payload: Record<string, unknown>,
  ): Record<string, string | number> | null {
    const raw = payload['abilityPetMap'] ?? payload['AbilityPetMap'];
    if (!this.isObject(raw)) {
      return null;
    }
    const result: Record<string, string | number> = {};
    Object.entries(raw).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        result[key] = value;
      }
    });
    return Object.keys(result).length > 0 ? result : null;
  }

  private safeParseBattleJson(rawBattle: string): ReplayBattleJson | null {
    try {
      const parsed = JSON.parse(rawBattle) as unknown;
      return this.isObject(parsed) ? (parsed as ReplayBattleJson) : null;
    } catch {
      return null;
    }
  }

  private getBoard(
    battle: ReplayBattleJson,
    side: 'UserBoard' | 'OpponentBoard',
  ): Record<string, unknown> | null {
    const battleRecord = battle as unknown as Record<string, unknown>;
    const board = battleRecord[side];
    return this.isObject(board) ? board : null;
  }

  private getBoardLives(board: Record<string, unknown> | null): number | null {
    if (!board) {
      return null;
    }
    const direct =
      board['Lives'] ??
      board['lives'] ??
      board['Back'] ??
      board['health'] ??
      board['Health'];
    return this.toPositiveInt(direct);
  }

  private getBattleOutcome(battle: ReplayBattleJson): number {
    const battleRecord = battle as unknown as Record<string, unknown>;
    return this.toNumberOrFallback(battleRecord['Outcome'], 3);
  }

  private getDisplayName(
    battle: ReplayBattleJson | undefined,
    key: 'User' | 'Opponent',
  ): string | null {
    const battleRecord = battle as unknown as Record<string, unknown> | null;
    if (!battleRecord) {
      return null;
    }
    const side = battleRecord[key];
    if (!this.isObject(side)) {
      return null;
    }
    const value = side['DisplayName'];
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private getRecord(
    value: Record<string, unknown>,
    key: string,
  ): Record<string, unknown> | null {
    const entry = value[key];
    return this.isObject(entry) ? (entry as Record<string, unknown>) : null;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private toPositiveInt(value: unknown): number | null {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    const whole = Math.trunc(parsed);
    return whole > 0 ? whole : null;
  }

  private toNumberOrFallback(value: unknown, fallback: number): number {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private throwIfAborted(abortSignal?: AbortSignal): void {
    if (!abortSignal?.aborted) {
      return;
    }
    throw new Error('Positioning image build cancelled.');
  }

  private emitProgress(
    input: ReplayPositioningImageBuildInput,
    percent: number,
    message: string,
    phase: 'preparing' | 'optimizing' | 'rendering',
    currentTurn: number,
    totalTurns: number,
  ): void {
    input.onProgress?.({
      percent: Math.max(0, Math.min(100, percent)),
      message,
      phase,
      currentTurn,
      totalTurns,
    });
  }

  private computeOverallProgress(
    completedTurns: number,
    totalTurns: number,
    currentTurnPercent: number,
  ): number {
    if (totalTurns <= 0) {
      return 0;
    }
    const perTurn = 95 / totalTurns;
    const done = completedTurns * perTurn;
    const inTurn = (Math.max(0, Math.min(100, currentTurnPercent)) / 100) * perTurn;
    return 3 + Math.min(95, done + inTurn);
  }
}



