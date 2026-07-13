import { Injectable } from '@angular/core';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import {
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';
import { SimulationRunner } from 'app/gameplay/simulation-runner';
import { GameService } from 'app/runtime/state/game.service';
import { AbilityService } from '../ability/ability.service';
import { EquipmentService } from '../equipment/equipment.service';
import { LogService } from '../log.service';
import { PetService } from '../pet/pet.service';
import {
  BoardStrengthPrecision,
  BoardStrengthProgress,
  BoardStrengthResult,
  BoardStrengthSide,
  createBoardStrengthFingerprint,
  getBoardStrengthPrecisionProfile,
  runBoardStrengthEvaluation,
} from '../simulation/board-strength-evaluator';
import { ToyService } from '../toy/toy.service';
import {
  getEquipmentIconPath,
  getPetIconPath,
  getToyIconPath,
} from 'app/runtime/asset-catalog';
import {
  ReplayBattleJson,
  ReplayBuildModelJson,
  ReplayCalculatorState,
  buildReplayAbilityPetMapFromActions,
} from './replay-calc-parser';
import { ReplayBattleResponse, ReplayCalcService } from './replay-calc.service';
import {
  ReplayImageBattleInfo,
  ReplayImageCanvasRendererService,
  ReplayImagePetInfo,
} from './replay-image-canvas-renderer.service';
import {
  getReplayImageCalculatorState,
  mergeReplayImageCalculatorState,
} from './replay-image-calculator-state';

export interface ReplayBoardStrengthImageBuildInput {
  replayPayload: Record<string, unknown>;
  precision?: BoardStrengthPrecision;
  abilityPetMap?: Record<string, string | number> | null;
  abortSignal?: AbortSignal;
  onProgress?: (progress: ReplayBoardStrengthImageProgress) => void;
}

export interface ReplayBoardStrengthImageProgress {
  percent: number;
  message: string;
  phase: 'preparing' | 'evaluating' | 'rendering';
  currentTurn: number;
  totalTurns: number;
  side?: BoardStrengthSide;
}

export interface ReplayBoardStrengthImageHotspot {
  turn: number;
  calculatorUrl: string;
  top: number;
  height: number;
}

export interface ReplayBoardStrengthImagePreview {
  width: number;
  height: number;
  hotspots: ReplayBoardStrengthImageHotspot[];
}

export interface ReplayBoardStrengthImageResult {
  blob: Blob;
  preview: ReplayBoardStrengthImagePreview;
}

interface ReplayActionEntry {
  Type?: number;
  Turn?: number | string | null;
  Battle?: string;
}

interface StrengthBattleRow {
  turn: number;
  battle: ReplayBattleJson;
}

interface PreparedStrengthRow {
  turn: number;
  battle: ReplayBattleJson;
  calculatorState: ReplayCalculatorState;
  config: SimulationConfig;
  playerKey: string;
  opponentKey: string;
  calculatorUrl: string;
  renderInfo: ReplayImageBattleInfo;
}

interface StrengthEvaluationTask {
  key: string;
  turn: number;
  side: BoardStrengthSide;
  config: SimulationConfig;
}

@Injectable({ providedIn: 'root' })
export class ReplayBoardStrengthImageService {
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

  async buildBoardStrengthImage(
    input: ReplayBoardStrengthImageBuildInput,
  ): Promise<ReplayBoardStrengthImageResult> {
    const precision = input.precision ?? 'quick';
    this.throwIfAborted(input.abortSignal);
    this.emitProgress(input, 0, 'Preparing replay turns...', 'preparing', 0, 0);
    const resolvedReplay = this.resolveReplayActionsContainer(
      input.replayPayload,
    );
    const turnRows = this.extractBattleRows(resolvedReplay);
    if (turnRows.length === 0) {
      throw new Error('Replay JSON did not contain battle turns.');
    }

    const replayActions = this.getReplayActions(resolvedReplay);
    const abilityPetMap =
      input.abilityPetMap ??
      this.getReplayAbilityPetMap(resolvedReplay) ??
      (replayActions
        ? buildReplayAbilityPetMapFromActions(replayActions)
        : null);
    const buildModel = this.getReplayBuildModel(resolvedReplay);
    const preparedRows: PreparedStrengthRow[] = [];
    const tasks = new Map<string, StrengthEvaluationTask>();

    for (let index = 0; index < turnRows.length; index += 1) {
      const row = turnRows[index];
      const parsedCalculatorState = this.replayCalcService.parseReplayForCalculator(
        row.battle,
        buildModel ?? undefined,
        undefined,
        { abilityPetMap },
      );
      const calculatorState = mergeReplayImageCalculatorState(
        parsedCalculatorState,
        getReplayImageCalculatorState(resolvedReplay, row.turn),
      );
      const previousOutcome =
        index > 0 ? this.getBattleOutcome(turnRows[index - 1].battle) : null;
      const config: SimulationConfig = {
        ...this.createSimulationConfigFromCalculatorState(calculatorState),
        playerLostLastBattle: previousOutcome === 2,
        opponentLostLastBattle: previousOutcome === 1,
      };
      const playerKey = `player:${createBoardStrengthFingerprint(config, 'player')}`;
      const opponentKey = `opponent:${createBoardStrengthFingerprint(config, 'opponent')}`;
      tasks.set(playerKey, {
        key: playerKey,
        turn: row.turn,
        side: 'player',
        config,
      });
      tasks.set(opponentKey, {
        key: opponentKey,
        turn: row.turn,
        side: 'opponent',
        config,
      });
      preparedRows.push({
        turn: row.turn,
        battle: row.battle,
        calculatorState,
        config,
        playerKey,
        opponentKey,
        calculatorUrl:
          this.replayCalcService.generateCalculatorLink(calculatorState),
        renderInfo: this.toRenderBattleInfo(row.battle, calculatorState),
      });
    }

    this.emitProgress(
      input,
      5,
      `Prepared ${turnRows.length} turns and ${tasks.size} unique boards.`,
      'preparing',
      0,
      turnRows.length,
    );
    const results = new Map<string, BoardStrengthResult>();
    const taskList = [...tasks.values()];
    for (let index = 0; index < taskList.length; index += 1) {
      const task = taskList[index];
      this.throwIfAborted(input.abortSignal);
      const result = await this.runEvaluation(
        task.config,
        task.side,
        precision,
        input.abortSignal,
        (progress) => {
          const taskProgress = this.getEvaluationProgress(progress, precision);
          const percent =
            5 + ((index + taskProgress) / Math.max(1, taskList.length)) * 90;
          this.emitProgress(
            input,
            percent,
            `Turn ${task.turn}: evaluating ${task.side} board (${progress.currentStat}/${progress.currentStat})...`,
            'evaluating',
            task.turn,
            turnRows.length,
            task.side,
          );
        },
      );
      results.set(task.key, result);
      this.emitProgress(
        input,
        5 + ((index + 1) / Math.max(1, taskList.length)) * 90,
        `Turn ${task.turn}: ${task.side} strength ${result.score.toFixed(1)}.`,
        'evaluating',
        task.turn,
        turnRows.length,
        task.side,
      );
    }

    this.throwIfAborted(input.abortSignal);
    this.emitProgress(
      input,
      98,
      'Rendering board strength image...',
      'rendering',
      turnRows.length,
      turnRows.length,
    );
    return this.renderImage(preparedRows, results);
  }

  async buildBoardStrengthImageBlob(
    input: ReplayBoardStrengthImageBuildInput,
  ): Promise<Blob> {
    return (await this.buildBoardStrengthImage(input)).blob;
  }

  private runEvaluation(
    config: SimulationConfig,
    side: BoardStrengthSide,
    precision: BoardStrengthPrecision,
    abortSignal: AbortSignal | undefined,
    onProgress: (progress: BoardStrengthProgress) => void,
  ): Promise<BoardStrengthResult> {
    if (typeof Worker !== 'undefined') {
      return this.runEvaluationInWorker(
        config,
        side,
        precision,
        abortSignal,
        onProgress,
      );
    }
    return Promise.resolve(
      runBoardStrengthEvaluation({
        baseConfig: config,
        options: { side, precision },
        shouldAbort: () => Boolean(abortSignal?.aborted),
        onProgress,
        simulateBatch: (batchConfig) => this.runLocalSimulation(batchConfig),
      }),
    );
  }

  private runEvaluationInWorker(
    config: SimulationConfig,
    side: BoardStrengthSide,
    precision: BoardStrengthPrecision,
    abortSignal: AbortSignal | undefined,
    onProgress: (progress: BoardStrengthProgress) => void,
  ): Promise<BoardStrengthResult> {
    return new Promise<BoardStrengthResult>((resolve, reject) => {
      const worker = new Worker(
        new URL('../simulation/simulation.worker', import.meta.url),
        { type: 'module' },
      );
      let settled = false;
      const cleanup = () => {
        worker.terminate();
        abortSignal?.removeEventListener('abort', abortListener);
      };
      const finishResolve = (result: BoardStrengthResult) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(result);
      };
      const finishReject = (error: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      };
      const abortListener = () => {
        finishReject(new Error('Board strength image build cancelled.'));
      };
      if (abortSignal?.aborted) {
        finishReject(new Error('Board strength image build cancelled.'));
        return;
      }
      abortSignal?.addEventListener('abort', abortListener, { once: true });
      worker.onmessage = ({ data }) => {
        if (!data?.type) return;
        if (data.type === 'board-strength-progress') {
          onProgress(data.progress as BoardStrengthProgress);
        } else if (data.type === 'board-strength-result') {
          finishResolve(data.result as BoardStrengthResult);
        } else if (data.type === 'board-strength-aborted') {
          finishReject(new Error('Board strength image build cancelled.'));
        } else if (data.type === 'error') {
          finishReject(
            new Error(data.message || 'Board strength evaluation failed.'),
          );
        }
      };
      worker.onerror = (event) => {
        finishReject(
          new Error(event.message || 'Board strength evaluation failed.'),
        );
      };
      worker.postMessage({
        type: 'board-strength-start',
        config,
        options: { side, precision },
      });
    });
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

  private async renderImage(
    rows: PreparedStrengthRow[],
    results: Map<string, BoardStrengthResult>,
  ): Promise<ReplayBoardStrengthImageResult> {
    const firstInfo = rows[0]?.renderInfo;
    const title =
      firstInfo?.playerName && firstInfo?.opponentName
        ? `${firstInfo.playerName} vs ${firstInfo.opponentName} (Board Strength)`
        : 'Replay Board Strength';
    const session = this.replayImageRenderer.createSession({
      rowCount: rows.length,
      title,
    });

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const { baseY } = await this.replayImageRenderer.drawBattleRow(session, {
        index,
        turn: row.turn,
        info: row.renderInfo,
      });
      const playerResult = results.get(row.playerKey);
      const opponentResult = results.get(row.opponentKey);
      this.drawStrengthComparison(
        session.ctx,
        baseY,
        playerResult?.score ?? 0,
        opponentResult?.score ?? 0,
        playerResult?.rangeTruncated ?? false,
        opponentResult?.rangeTruncated ?? false,
      );
    }

    const footerY = this.replayImageRenderer.drawFooterBackground(session);
    session.ctx.fillStyle = '#111111';
    session.ctx.font = '14px Arial';
    session.ctx.textAlign = 'left';
    session.ctx.fillText(
      'BS1 · High precision · The no-ability five-pet benchmark range automatically expands for stronger boards.',
      25,
      footerY + 27,
    );

    return {
      blob: await this.replayImageRenderer.toBlob(session),
      preview: {
        width: session.width,
        height: session.height,
        hotspots: rows.map((row, index) => ({
          turn: row.turn,
          calculatorUrl: row.calculatorUrl,
          top: session.headerHeight + index * session.rowHeight,
          height: session.rowHeight,
        })),
      },
    };
  }

  private drawStrengthComparison(
    ctx: CanvasRenderingContext2D,
    baseY: number,
    playerStrength: number,
    opponentStrength: number,
    playerTruncated: boolean,
    opponentTruncated: boolean,
  ): void {
    ctx.strokeStyle = '#BCC5D0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(720, baseY - 8);
    ctx.lineTo(720, baseY + 76);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#2563EB';
    ctx.fillText('PLAYER', 680, baseY + 3);
    ctx.fillStyle = '#C62828';
    ctx.fillText('OPPONENT', 760, baseY + 3);
    ctx.font = 'bold 25px Arial';
    ctx.fillStyle = '#174EA6';
    ctx.fillText(`${playerStrength.toFixed(1)}${playerTruncated ? '+' : ''}`, 680, baseY + 35);
    ctx.fillStyle = '#B00020';
    ctx.fillText(`${opponentStrength.toFixed(1)}${opponentTruncated ? '+' : ''}`, 760, baseY + 35);
    ctx.font = '10px Arial';
    ctx.fillStyle = '#5F6368';
    ctx.fillText('strength', 680, baseY + 51);
    ctx.fillText('strength', 760, baseY + 51);
    ctx.textAlign = 'left';
  }

  private toRenderBattleInfo(
    battle: ReplayBattleJson,
    state: ReplayCalculatorState,
  ): ReplayImageBattleInfo {
    return {
      outcome: this.getBattleOutcome(battle),
      playerName: this.getDisplayName(battle, 'User'),
      opponentName: this.getDisplayName(battle, 'Opponent'),
      playerLives: this.getBoardLives(this.getBoard(battle, 'UserBoard')),
      opponentLives: this.getBoardLives(
        this.getBoard(battle, 'OpponentBoard'),
      ),
      playerPets: this.toRenderPets(state.playerPets),
      opponentPets: this.toRenderPets(state.opponentPets),
      playerToy: state.playerToy
        ? {
            imagePath: getToyIconPath(state.playerToy),
            level: this.toNumberOrFallback(state.playerToyLevel, 1),
          }
        : null,
      opponentToy: state.opponentToy
        ? {
            imagePath: getToyIconPath(state.opponentToy),
            level: this.toNumberOrFallback(state.opponentToyLevel, 1),
          }
        : null,
    };
  }

  private toRenderPets(
    pets: ReplayCalculatorState['playerPets'],
  ): Array<ReplayImagePetInfo | null> {
    return pets.map((pet) => {
      if (!pet?.name) return null;
      return {
        imagePath: getPetIconPath(pet.name),
        perkImagePath: pet.equipment?.name
          ? getEquipmentIconPath(pet.equipment.name)
          : null,
        attack: this.toNumberOrFallback(pet.attack, 0),
        health: this.toNumberOrFallback(pet.health, 0),
        level:
          this.toNumberOrFallback(pet.exp, 0) >= 5
            ? 3
            : this.toNumberOrFallback(pet.exp, 0) >= 2
              ? 2
              : 1,
        xp: this.toNumberOrFallback(pet.exp, 0),
      };
    });
  }

  private createSimulationConfigFromCalculatorState(
    state: ReplayCalculatorState,
  ): SimulationConfig {
    return {
      playerPack: state.playerPack,
      opponentPack: state.opponentPack,
      playerToy: state.playerToy,
      playerToyLevel: this.toNumberOrFallback(state.playerToyLevel, 1),
      playerHardToy: state.playerHardToy,
      playerHardToyLevel: state.playerHardToyLevel,
      opponentToy: state.opponentToy,
      opponentToyLevel: this.toNumberOrFallback(state.opponentToyLevel, 1),
      opponentHardToy: state.opponentHardToy,
      opponentHardToyLevel: state.opponentHardToyLevel,
      turn: state.turn,
      playerGoldSpent: state.playerGoldSpent,
      opponentGoldSpent: state.opponentGoldSpent,
      playerRollAmount: state.playerRollAmount,
      opponentRollAmount: state.opponentRollAmount,
      playerSummonedAmount: state.playerSummonedAmount,
      opponentSummonedAmount: state.opponentSummonedAmount,
      playerLevel3Sold: state.playerLevel3Sold,
      opponentLevel3Sold: state.opponentLevel3Sold,
      playerTransformationAmount: state.playerTransformationAmount,
      opponentTransformationAmount: state.opponentTransformationAmount,
      playerPets: state.playerPets,
      opponentPets: state.opponentPets,
      customPacks: state.customPacks,
      allPets: state.allPets,
      oldStork: state.oldStork,
      tokenPets: state.tokenPets,
      komodoShuffle: state.komodoShuffle,
      mana: state.mana,
      seed: state.seed,
      simulationCount: 1,
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
    const replay = this.getRecord(payload, 'replay');
    const nestedRawJson = replay ? this.getRecord(replay, 'raw_json') : null;
    return nestedRawJson && Array.isArray(nestedRawJson['Actions'])
      ? nestedRawJson
      : payload;
  }

  private extractBattleRows(
    payload: Record<string, unknown>,
  ): StrengthBattleRow[] {
    const actions = this.getReplayActions(payload);
    if (!actions || actions.length === 0) {
      const turns = payload['turns'];
      if (!Array.isArray(turns)) return [];
      const builder = this.replayCalcService as unknown as {
        buildReplayBattleResponseFromTurns: (
          turnsResponse: unknown,
          requestedTurn: number,
          replayId: string,
        ) => ReplayBattleResponse;
      };
      const replayId = this.getReplayIdFromPayload(payload) ?? 'manual-replay';
      const rows: StrengthBattleRow[] = [];
      for (let index = 0; index < turns.length; index += 1) {
        try {
          const response = builder.buildReplayBattleResponseFromTurns(
            payload,
            index + 1,
            replayId,
          );
          if (response.battle) {
            rows.push({ turn: index + 1, battle: response.battle });
          }
        } catch {
          // Ignore malformed turns while preserving usable replay rows.
        }
      }
      return rows;
    }
    let fallbackTurn = 1;
    return actions
      .map((action) => {
        const type = this.toNumberOrFallback(action.Type, 0);
        if ((type !== 0 && type !== 1) || typeof action.Battle !== 'string') {
          return null;
        }
        const battle = this.safeParseBattleJson(action.Battle);
        if (!battle) return null;
        const turn = this.toPositiveInt(action.Turn) ?? fallbackTurn;
        fallbackTurn += 1;
        return { turn, battle };
      })
      .filter((row): row is StrengthBattleRow => row !== null);
  }

  private getEvaluationProgress(
    progress: BoardStrengthProgress,
    precision: BoardStrengthPrecision,
  ): number {
    if (progress.phase === 'complete') return 1;
    if (progress.phase === 'scout') return 0.03;
    if (progress.phase === 'scan') {
      return (progress.completedStats / Math.max(1, progress.totalStats)) * 0.5;
    }
    const profile = getBoardStrengthPrecisionProfile(precision);
    const initial = progress.totalStats * profile.initialBattles;
    const capacity = Math.max(1, progress.maximumBattles - initial);
    return Math.min(
      0.95,
      0.5 +
        (Math.max(0, progress.battlesCompleted - initial) / capacity) * 0.45,
    );
  }

  private getReplayActions(
    payload: Record<string, unknown>,
  ): ReplayActionEntry[] | null {
    return Array.isArray(payload['Actions'])
      ? (payload['Actions'] as ReplayActionEntry[])
      : null;
  }

  private getReplayBuildModel(
    payload: Record<string, unknown>,
  ): ReplayBuildModelJson | null {
    const value = payload['GenesisBuildModel'];
    return this.isObject(value) ? (value as ReplayBuildModelJson) : null;
  }

  private getReplayAbilityPetMap(
    payload: Record<string, unknown>,
  ): Record<string, string | number> | null {
    const raw = payload['abilityPetMap'] ?? payload['AbilityPetMap'];
    if (!this.isObject(raw)) return null;
    const result: Record<string, string | number> = {};
    Object.entries(raw).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        result[key] = value;
      }
    });
    return Object.keys(result).length ? result : null;
  }

  private getReplayIdFromPayload(
    payload: Record<string, unknown>,
  ): string | null {
    if (typeof payload['replayId'] === 'string') {
      return payload['replayId'];
    }
    const replay = this.getRecord(payload, 'replay');
    return typeof replay?.['id'] === 'string' ? replay['id'] : null;
  }

  private safeParseBattleJson(raw: string): ReplayBattleJson | null {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return this.isObject(parsed) ? (parsed as ReplayBattleJson) : null;
    } catch {
      return null;
    }
  }

  private getBoard(
    battle: ReplayBattleJson,
    side: 'UserBoard' | 'OpponentBoard',
  ): Record<string, unknown> | null {
    const value = (battle as unknown as Record<string, unknown>)[side];
    return this.isObject(value) ? value : null;
  }

  private getBoardLives(board: Record<string, unknown> | null): number | null {
    if (!board) return null;
    return this.toPositiveInt(
      board['Lives'] ??
        board['lives'] ??
        board['Back'] ??
        board['health'] ??
        board['Health'],
    );
  }

  private getBattleOutcome(battle: ReplayBattleJson): number {
    return this.toNumberOrFallback(
      (battle as unknown as Record<string, unknown>)['Outcome'],
      3,
    );
  }

  private getDisplayName(
    battle: ReplayBattleJson,
    key: 'User' | 'Opponent',
  ): string | null {
    const side = (battle as unknown as Record<string, unknown>)[key];
    if (!this.isObject(side)) return null;
    return typeof side['DisplayName'] === 'string' ? side['DisplayName'] : null;
  }

  private getRecord(
    value: Record<string, unknown>,
    key: string,
  ): Record<string, unknown> | null {
    const entry = value[key];
    return this.isObject(entry) ? entry : null;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private toPositiveInt(value: unknown): number | null {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    const whole = Math.trunc(parsed);
    return whole > 0 ? whole : null;
  }

  private toNumberOrFallback(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private throwIfAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
      throw new Error('Board strength image build cancelled.');
    }
  }

  private emitProgress(
    input: ReplayBoardStrengthImageBuildInput,
    percent: number,
    message: string,
    phase: ReplayBoardStrengthImageProgress['phase'],
    currentTurn: number,
    totalTurns: number,
    side?: BoardStrengthSide,
  ): void {
    input.onProgress?.({
      percent: Math.max(0, Math.min(100, percent)),
      message,
      phase,
      currentTurn,
      totalTurns,
      side,
    });
  }
}
