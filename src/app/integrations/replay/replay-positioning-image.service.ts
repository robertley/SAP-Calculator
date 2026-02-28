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
  runPositioningOptimization,
} from '../simulation/positioning-optimizer';
import * as petsData from 'assets/data/pets.json';
import * as perksData from 'assets/data/perks.json';
import * as toysData from 'assets/data/toys.json';

export interface ReplayPositioningImageBuildInput {
  replayPayload: Record<string, unknown>;
  simulationCount: number;
  optimizationSide: 'player' | 'opponent';
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

interface ReplayActionEntry {
  Type?: number;
  Turn?: number | string | null;
  Battle?: string;
}

interface ContentEntry {
  Id?: string | number;
  Name?: string;
  NameId?: string;
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
  battle: ReplayBattleJson;
  optimizedPlayerPets: Array<RenderPetInfo | null>;
  optimizedOpponentPets: Array<RenderPetInfo | null>;
  delta: TurnDeltaSummary;
}

interface RenderPetInfo {
  imagePath: string | null;
  perkImagePath: string | null;
  attack: number;
  health: number;
  level: number;
  xp: number;
}

interface RenderToyInfo {
  imagePath: string | null;
  level: number;
}

interface RenderBattleInfo {
  outcome: number;
  opponentName: string | null;
  playerName: string | null;
  playerLives: number | null;
  opponentLives: number | null;
  playerPets: RenderPetInfo[];
  opponentPets: RenderPetInfo[];
  playerToy: RenderToyInfo | null;
  opponentToy: RenderToyInfo | null;
}

const MODULE_PETS =
  ((petsData as unknown as { default?: ContentEntry[] }).default ??
    (petsData as unknown as ContentEntry[])) ?? [];
const MODULE_PERKS =
  ((perksData as unknown as { default?: ContentEntry[] }).default ??
    (perksData as unknown as ContentEntry[])) ?? [];
const MODULE_TOYS =
  ((toysData as unknown as { default?: ContentEntry[] }).default ??
    (toysData as unknown as ContentEntry[])) ?? [];

const PET_NAME_ID_BY_ID = new Map<string, string>(
  MODULE_PETS
    .filter(
      (entry): entry is ContentEntry =>
        typeof entry?.Id !== 'undefined' && typeof entry?.NameId === 'string',
    )
    .map((entry) => [String(entry.Id), entry.NameId as string]),
);

const PERK_NAME_ID_BY_ID = new Map<string, string>(
  MODULE_PERKS
    .filter(
      (entry): entry is ContentEntry =>
        typeof entry?.Id !== 'undefined' && typeof entry?.NameId === 'string',
    )
    .map((entry) => [String(entry.Id), entry.NameId as string]),
);

const TOY_NAME_ID_BY_ID = new Map<string, string>(
  MODULE_TOYS
    .filter(
      (entry): entry is ContentEntry =>
        typeof entry?.Id !== 'undefined' && typeof entry?.NameId === 'string',
    )
    .map((entry) => [String(entry.Id), entry.NameId as string]),
);

const PET_NAME_ID_BY_KEY = new Map<string, string>();
const PERK_NAME_ID_BY_KEY = new Map<string, string>();

MODULE_PETS.forEach((entry) => {
  if (typeof entry?.NameId !== 'string') {
    return;
  }
  const byName = normalizeLookupKey(entry.Name);
  const byNameId = normalizeLookupKey(entry.NameId);
  if (byName) {
    PET_NAME_ID_BY_KEY.set(byName, entry.NameId);
  }
  if (byNameId) {
    PET_NAME_ID_BY_KEY.set(byNameId, entry.NameId);
  }
});

MODULE_PERKS.forEach((entry) => {
  if (typeof entry?.NameId !== 'string') {
    return;
  }
  const byName = normalizeLookupKey(entry.Name);
  const byNameId = normalizeLookupKey(entry.NameId);
  if (byName) {
    PERK_NAME_ID_BY_KEY.set(byName, entry.NameId);
  }
  if (byNameId) {
    PERK_NAME_ID_BY_KEY.set(byNameId, entry.NameId);
  }
});

function normalizeLookupKey(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

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
  ) {}

  async buildPositioningImageBlob(
    input: ReplayPositioningImageBuildInput,
  ): Promise<Blob> {
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
      const calculatorState = this.replayCalcService.parseReplayForCalculator(
        row.battle,
        buildModel ?? undefined,
        undefined,
        { abilityPetMap },
      );
      const previousOutcome =
        turnIndex > 0
          ? this.getBattleOutcome(turnRows[turnIndex - 1].battle)
          : null;
      const baseConfig: SimulationConfig = {
        ...this.createSimulationConfigFromCalculatorState(
          calculatorState,
          input.simulationCount,
        ),
        playerLostLastBattle: previousOutcome === 2,
        opponentLostLastBattle: previousOutcome === 1,
      };
      const baselineResult = this.runLocalSimulation(baseConfig);
      const optimizationResult = await this.runOptimization(
        baseConfig,
        input.simulationCount,
        input.optimizationSide,
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
      const optimizedConfig: SimulationConfig = {
        ...baseConfig,
        playerPets:
          input.optimizationSide === 'player'
            ? optimizationResult.bestPermutation.lineup
            : baseConfig.playerPets,
        opponentPets:
          input.optimizationSide === 'opponent'
            ? optimizationResult.bestPermutation.lineup
            : baseConfig.opponentPets,
        simulationCount: input.simulationCount,
      };
      const optimizedResult = this.runLocalSimulation(optimizedConfig);
      this.throwIfAborted(input.abortSignal);
      const baselineOdds = this.toOddsSummary(baselineResult, input.optimizationSide);
      const optimizedOdds = this.toOddsSummary(optimizedResult, input.optimizationSide);
      const baselineScore = this.toOptimizationScore(baselineOdds);
      const optimizedScore = this.toOptimizationScore(optimizedOdds);
      const isSignificantIncrease = this.isStatisticallySignificantImprovement(
        optimizationResult,
        baselineResult,
        input.optimizationSide,
      );
      const shouldApplyOptimized =
        isSignificantIncrease && optimizedScore > baselineScore;
      const effectiveOptimizedResult = shouldApplyOptimized
        ? optimizedResult
        : baselineResult;

      const delta = this.buildDeltaSummary(
        baselineResult,
        effectiveOptimizedResult,
        input.optimizationSide,
      );
      const optimizedPlayerPets =
        shouldApplyOptimized && input.optimizationSide === 'player'
          ? this.buildRenderPetsFromPetConfigLineup(
              optimizationResult.bestPermutation.lineup,
            )
          : [];
      const optimizedOpponentPets =
        shouldApplyOptimized && input.optimizationSide === 'opponent'
          ? this.buildRenderPetsFromPetConfigLineup(
              optimizationResult.bestPermutation.lineup,
            )
          : [];

      optimizedRows.push({
        turn: row.turn,
        battle: row.battle,
        optimizedPlayerPets,
        optimizedOpponentPets,
        delta,
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

    const renderInfo = optimizedRows.map((row) => this.toRenderBattleInfo(row.battle));
    this.emitProgress(input, 98, 'Rendering image...', 'rendering', totalTurns, totalTurns);
    return this.renderPositioningImage(
      optimizedRows,
      renderInfo,
      input.simulationCount,
      input.optimizationSide,
    );
  }

  private runOptimization(
    baseConfig: SimulationConfig,
    simulationCount: number,
    optimizationSide: 'player' | 'opponent',
    abortSignal?: AbortSignal,
    onProgress?: (percent: number) => void,
  ): Promise<PositioningOptimizationResult> {
    if (typeof Worker !== 'undefined') {
      return this.runOptimizationInWorker(
        baseConfig,
        simulationCount,
        optimizationSide,
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
          batchSize: Math.max(10, Math.min(25, simulationCount)),
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
        simulateBatch: (config) => this.runLocalSimulation(config),
      }),
    );
  }

  private runOptimizationInWorker(
    baseConfig: SimulationConfig,
    simulationCount: number,
    optimizationSide: 'player' | 'opponent',
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
          batchSize: Math.max(10, Math.min(25, simulationCount)),
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

  private toOptimizationScore(odds: OddsSummary): number {
    return odds.win + odds.draw * 0.5;
  }

  private isStatisticallySignificantImprovement(
    optimizationResult: PositioningOptimizationResult,
    baselineResult: SimulationResult,
    side: 'player' | 'opponent',
  ): boolean {
    const optimizedLowerBound = optimizationResult?.bestPermutation?.lowerBound;
    if (!Number.isFinite(optimizedLowerBound)) {
      return false;
    }

    const totalBattles =
      baselineResult.playerWins + baselineResult.opponentWins + baselineResult.draws;
    if (totalBattles <= 0) {
      return false;
    }

    const baselineOdds = this.toOddsSummary(baselineResult, side);
    const baselineScore = this.toOptimizationScore(baselineOdds) / 100;
    const variance = Math.max(0, baselineScore * (1 - baselineScore));
    const margin = 1.96 * Math.sqrt(variance / totalBattles);
    const baselineUpperBound = Math.min(1, baselineScore + margin);

    return optimizedLowerBound > baselineUpperBound;
  }

  private buildRenderPetsFromPetConfigLineup(
    lineup: (PetConfig | null)[],
  ): Array<RenderPetInfo | null> {
    return lineup.map((pet) => {
      if (!pet?.name) {
        return null;
      }
      const petNameId = PET_NAME_ID_BY_KEY.get(normalizeLookupKey(pet.name)) ?? null;
      const equipmentName = pet?.equipment?.name ?? null;
      const perkNameId = equipmentName
        ? (PERK_NAME_ID_BY_KEY.get(normalizeLookupKey(equipmentName)) ?? null)
        : null;
      return {
        imagePath: petNameId ? `/assets/art/Public/Public/Pets/${petNameId}.png` : null,
        perkImagePath: perkNameId ? `/assets/art/Public/Public/Food/${perkNameId}.png` : null,
        attack: this.toNumberOrFallback(pet.attack, 0),
        health: this.toNumberOrFallback(pet.health, 0),
        level: this.toNumberOrFallback(pet.exp, 1) >= 5 ? 3 : this.toNumberOrFallback(pet.exp, 1) >= 2 ? 2 : 1,
        xp: this.toNumberOrFallback(pet.exp, 0),
      };
    });
  }

  private async renderPositioningImage(
    rows: OptimizedTurnRow[],
    renderInfo: RenderBattleInfo[],
    simulationCount: number,
    optimizationSide: 'player' | 'opponent',
  ): Promise<Blob> {
    const PET_WIDTH = 50;
    const BATTLE_HEIGHT = 125;
    const BASE_CANVAS_WIDTH = 1250;
    const DELTA_COLUMN_WIDTH = 360;
    const FOOTER_HEIGHT = 60;
    const CANVAS_WIDTH = BASE_CANVAS_WIDTH + DELTA_COLUMN_WIDTH;
    const canvas = document.createElement('canvas');
    const headerHeight =
      renderInfo[0]?.playerName && renderInfo[0]?.opponentName ? 36 : 0;
    canvas.width = CANVAS_WIDTH;
    canvas.height = headerHeight + rows.length * BATTLE_HEIGHT + FOOTER_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas rendering is not available in this browser.');
    }

    const imageCache = new Map<string, Promise<HTMLImageElement | null>>();
    const loadImage = (src: string | null): Promise<HTMLImageElement | null> => {
      if (!src) {
        return Promise.resolve(null);
      }
      const cached = imageCache.get(src);
      if (cached) {
        return cached;
      }
      const promise = new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
      imageCache.set(src, promise);
      return promise;
    };

    const turnIconSize = (25 + PET_WIDTH) * 2;
    const livesIconSize = 15 + PET_WIDTH;
    const heartIcon = await loadImage('/assets/art/Public/Public/Icons/heart-from-textmap.png');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_WIDTH, canvas.height);
    if (headerHeight > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${renderInfo[0]?.playerName} vs ${renderInfo[0]?.opponentName} (Optimized Positioning)`,
        CANVAS_WIDTH / 2,
        24,
      );
      ctx.textAlign = 'left';
    }

    for (let i = 0; i < rows.length; i += 1) {
      const info = renderInfo[i];
      const row = rows[i];
      const rowStartY = headerHeight + i * BATTLE_HEIGHT;
      const baseY = rowStartY + 25;
      const playerRenderPets =
        optimizationSide === 'player' && row.optimizedPlayerPets.length > 0
          ? row.optimizedPlayerPets
          : info.playerPets;
      const opponentRenderPets =
        optimizationSide === 'opponent' && row.optimizedOpponentPets.length > 0
          ? row.optimizedOpponentPets
          : info.opponentPets;

      ctx.fillStyle =
        info.outcome === 1 ? '#E6F4EA' : info.outcome === 2 ? '#FDECEA' : '#F2F2F2';
      ctx.fillRect(0, rowStartY, CANVAS_WIDTH, BATTLE_HEIGHT);

      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText(String(row.turn), 25 + PET_WIDTH + 15, baseY + PET_WIDTH / 2 + 6);
      if (heartIcon) {
        ctx.drawImage(heartIcon, turnIconSize, baseY, PET_WIDTH, PET_WIDTH);
        if (info.playerLives !== null) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            String(info.playerLives),
            turnIconSize + PET_WIDTH / 2,
            baseY + (PET_WIDTH - 24) + 6,
          );
          ctx.textAlign = 'left';
        }
      }
      ctx.fillStyle = '#111111';
      ctx.font = '18px Arial';
      const resultText = info.outcome === 1 ? 'WIN' : info.outcome === 2 ? 'LOSS' : 'DRAW';
      ctx.fillText(resultText, turnIconSize + PET_WIDTH / 2 - 18, baseY + PET_WIDTH + 26);

      for (let x = 0; x < playerRenderPets.length && x < 5; x += 1) {
        const pet = playerRenderPets[x];
        if (!pet) {
          continue;
        }
        const posX = x * (PET_WIDTH + 25) + 25 + turnIconSize + livesIconSize;
        await this.drawPet(ctx, pet, posX, baseY, true, PET_WIDTH, loadImage);
      }
      if (info.playerToy) {
        await this.drawToy(
          ctx,
          info.playerToy,
          5 * (PET_WIDTH + 25) + turnIconSize + livesIconSize,
          baseY,
          PET_WIDTH,
          loadImage,
        );
      }

      for (let x = 0; x < opponentRenderPets.length && x < 5; x += 1) {
        const pet = opponentRenderPets[x];
        if (!pet) {
          continue;
        }
        const posX = BASE_CANVAS_WIDTH - (x * (PET_WIDTH + 25) + PET_WIDTH + 25);
        await this.drawPet(ctx, pet, posX, baseY, false, PET_WIDTH, loadImage);
      }
      if (info.opponentToy) {
        await this.drawToy(
          ctx,
          info.opponentToy,
          BASE_CANVAS_WIDTH - ((5 + 1) * (PET_WIDTH + 25)),
          baseY,
          PET_WIDTH,
          loadImage,
        );
      }

      const deltaX = BASE_CANVAS_WIDTH + 10;
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

    const footerY = headerHeight + rows.length * BATTLE_HEIGHT;
    const totalWinDelta = rows.reduce((sum, row) => sum + row.delta.deltaWin, 0);
    const totalLossDelta = rows.reduce((sum, row) => sum + row.delta.deltaLoss, 0);
    const totalDrawDelta = rows.reduce((sum, row) => sum + row.delta.deltaDraw, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, footerY, CANVAS_WIDTH, FOOTER_HEIGHT);
    ctx.fillStyle = '#111111';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Simulations per turn: ${simulationCount} | Optimization side: ${optimizationSide}`,
      25,
      footerY + 24,
    );
    ctx.fillText(
      `Total optimize delta across turns: Win ${this.formatDelta(totalWinDelta)}% | Loss ${this.formatDelta(totalLossDelta)}% | Draw ${this.formatDelta(totalDrawDelta)}%`,
      25,
      footerY + 44,
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG image.'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
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

  private async drawPet(
    ctx: CanvasRenderingContext2D,
    pet: RenderPetInfo,
    x: number,
    y: number,
    flip: boolean,
    petWidth: number,
    loadImage: (src: string | null) => Promise<HTMLImageElement | null>,
  ): Promise<void> {
    const petImage = await loadImage(pet.imagePath);
    if (petImage) {
      if (flip) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(petImage, -(x + petWidth), y, petWidth, petWidth);
        ctx.restore();
      } else {
        ctx.drawImage(petImage, x, y, petWidth, petWidth);
      }
    }
    const perkImage = await loadImage(pet.perkImagePath);
    if (perkImage) {
      ctx.drawImage(perkImage, x + 30, y - 10, 30, 30);
    }
    ctx.font = '18px Arial';
    ctx.fillStyle = 'green';
    ctx.textAlign = 'center';
    ctx.fillText(String(pet.attack), x + petWidth / 4, y + petWidth + 20);
    ctx.fillStyle = 'red';
    ctx.fillText(String(pet.health), x + (3 * petWidth) / 4, y + petWidth + 20);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'grey';
    ctx.fillText('Lvl', x, y - 6);
    ctx.font = '18px Arial';
    ctx.fillStyle = 'orange';
    ctx.fillText(String(pet.level), x + 18, y - 7.5);
    ctx.textAlign = 'left';
  }

  private async drawToy(
    ctx: CanvasRenderingContext2D,
    toy: RenderToyInfo,
    x: number,
    y: number,
    petWidth: number,
    loadImage: (src: string | null) => Promise<HTMLImageElement | null>,
  ): Promise<void> {
    const toyImage = await loadImage(toy.imagePath);
    if (toyImage) {
      ctx.drawImage(toyImage, x, y, petWidth, petWidth);
    }
    ctx.fillStyle = '#111111';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv${toy.level}`, x + petWidth / 2, y + (3 * petWidth) / 2);
    ctx.textAlign = 'left';
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

  private toRenderBattleInfo(battle: ReplayBattleJson): RenderBattleInfo {
    const userBoard = this.getBoard(battle, 'UserBoard');
    const opponentBoard = this.getBoard(battle, 'OpponentBoard');
    return {
      outcome: this.getBattleOutcome(battle),
      playerName: this.getDisplayName(battle, 'User'),
      opponentName: this.getDisplayName(battle, 'Opponent'),
      playerLives: this.getBoardLives(userBoard),
      opponentLives: this.getBoardLives(opponentBoard),
      playerPets: this.getBoardPets(userBoard),
      opponentPets: this.getBoardPets(opponentBoard),
      playerToy: this.getBoardToy(userBoard),
      opponentToy: this.getBoardToy(opponentBoard),
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

  private getBoardPets(board: Record<string, unknown> | null): RenderPetInfo[] {
    if (!board) {
      return [];
    }
    const mins = this.getRecord(board, 'Mins');
    const items = mins?.['Items'];
    if (!Array.isArray(items)) {
      return [];
    }

    const pets: RenderPetInfo[] = [];
    items.forEach((item) => {
      if (!this.isObject(item)) {
        return;
      }
      const petId = this.toReplayId(item['Enu']);
      if (!petId) {
        return;
      }
      const perkId = this.toReplayId(item['Perk']);
      const attackStats = this.getRecord(item, 'At');
      const healthStats = this.getRecord(item, 'Hp');
      const attack = this.toNumberOrFallback(attackStats?.['Perm'], 0);
      const health = this.toNumberOrFallback(healthStats?.['Perm'], 0);
      const petNameId = PET_NAME_ID_BY_ID.get(petId) ?? null;
      const perkNameId = perkId ? PERK_NAME_ID_BY_ID.get(perkId) ?? null : null;
      pets.push({
        imagePath: petNameId ? `/assets/art/Public/Public/Pets/${petNameId}.png` : null,
        perkImagePath: perkNameId ? `/assets/art/Public/Public/Food/${perkNameId}.png` : null,
        attack,
        health,
        level: this.toNumberOrFallback(item['Lvl'], 1),
        xp: this.toNumberOrFallback(item['Exp'], 0),
      });
    });
    return pets;
  }

  private getBoardToy(board: Record<string, unknown> | null): RenderToyInfo | null {
    if (!board) {
      return null;
    }
    const rel = this.getRecord(board, 'Rel') ?? this.getRecord(board, 'Relics');
    const items =
      (rel?.['Items'] as unknown[] | undefined) ??
      (Array.isArray(board['Relics']) ? (board['Relics'] as unknown[]) : undefined);
    if (!Array.isArray(items)) {
      return null;
    }
    const toyItem = items.find(
      (entry) => this.isObject(entry) && this.toReplayId(entry['Enu']) !== null,
    ) as Record<string, unknown> | undefined;
    if (!toyItem) {
      return null;
    }
    const toyId = this.toReplayId(toyItem['Enu']);
    if (!toyId) {
      return null;
    }
    const toyNameId = TOY_NAME_ID_BY_ID.get(toyId) ?? null;
    return {
      imagePath: toyNameId ? `/assets/art/Public/Public/Toys/${toyNameId}.png` : null,
      level: this.toNumberOrFallback(toyItem['Lvl'], 1),
    };
  }

  private getBoardLives(board: Record<string, unknown> | null): number | null {
    if (!board) {
      return null;
    }
    const direct =
      board['Back'] ??
      board['health'] ??
      board['Health'] ??
      board['Lives'] ??
      board['lives'];
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

  private toReplayId(value: unknown): string | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
    return null;
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
