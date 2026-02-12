import { FormArray, FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';
import { Battle } from 'app/domain/interfaces/battle.interface';
import { Log } from 'app/domain/interfaces/log.interface';
import { LocalStorageService } from 'app/runtime/state/local-storage.service';
import { LogService } from 'app/integrations/log.service';
import { SimulationService } from 'app/integrations/simulation/simulation.service';
import {
  RandomDecisionCapture,
  PetConfig,
  SimulationConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import {
  PositioningOptimizationResult,
  PositioningOptimizationSide,
} from 'app/integrations/simulation/positioning-optimizer';
import { buildApiResponse as buildApiResponsePayload } from '../state/app.component.share';
import {
  EMPTY_DIFF_SUMMARY,
  getLogActorLabel,
  getLogSide,
  getPlayerClass,
  getPlainLogText,
  getTimelineReason,
  normalizeDiffScope,
  parseLogMessage,
  summarizeBattleForDiff,
} from './app.component.simulation-log';
import type {
  BattleDiffRow,
  BattleDiffScope,
  BattleDiffSummary,
  BattleTimelineRow,
  LogMessagePart,
} from './app.component.simulation-log';

export interface AppSimulationContext {
  formGroup: FormGroup;
  localStorageService: LocalStorageService;
  simulationService: SimulationService;
  logService: LogService;
  player: Player;
  opponent: Player;
  simulationBattleAmt: number;
  playerWinner: number;
  opponentWinner: number;
  draw: number;
  battles: Battle[];
  battleRandomEvents: LogMessagePart[][];
  battleRandomEventsByBattle: Map<Battle, LogMessagePart[]>;
  filteredBattlesCache: Battle[];
  viewBattle: Battle | null;
  viewBattleLogs: Log[];
  viewBattleLogRows: Array<{ parts: LogMessagePart[]; classes: string[] }>;
  viewBattleTimelineRows: BattleTimelineRow[];
  diffBattleLeftIndex: number;
  diffBattleRightIndex: number;
  diffBattleLeftScope: BattleDiffScope;
  diffBattleRightScope: BattleDiffScope;
  battleDiffRows: BattleDiffRow[];
  battleDiffSummary: BattleDiffSummary;
  simulated: boolean;
  apiResponse: string | null;
  api?: boolean;
  simulationInProgress?: boolean;
  simulationProgress?: number;
  simulationProgressLabel?: string;
  simulationWorker?: Worker | null;
  simulationCancelRequested?: boolean;
  simulationRunId?: number;
  markForCheck?: () => void;
  afterPositioningApplied?: () => void;
  setStatus?: (message: string, tone?: 'success' | 'error') => void;
  randomDecisions?: RandomDecisionCapture[];
  randomOverrideError?: string | null;
}

const logPartsCache = new WeakMap<
  Log,
  { message: string; parts: LogMessagePart[] }
>();
const parsedMessageCache = new Map<string, LogMessagePart[]>();
const viewBattleLogRowsCache = new WeakMap<
  Battle,
  {
    logs: Log[];
    rows: Array<{ parts: LogMessagePart[]; classes: string[] }>;
  }
>();
const PARSED_MESSAGE_CACHE_MAX = 1000;

function cacheParsedMessage(message: string, parts: LogMessagePart[]): void {
  parsedMessageCache.set(message, parts);
  if (parsedMessageCache.size <= PARSED_MESSAGE_CACHE_MAX) {
    return;
  }
  const oldestKey = parsedMessageCache.keys().next().value;
  if (oldestKey) {
    parsedMessageCache.delete(oldestKey);
  }
}

function getLogMessageParts(
  log: Log,
  logService: LogService | null,
): LogMessagePart[] {
  if (logService) {
    logService.decorateLogIfNeeded(log);
  }
  const message = log.message + (log.count > 1 ? ` (x${log.count})` : '');
  const cached = logPartsCache.get(log);
  if (cached && cached.message === message) {
    return cached.parts;
  }
  const cachedByMessage = parsedMessageCache.get(message);
  if (cachedByMessage) {
    logPartsCache.set(log, { message, parts: cachedByMessage });
    return cachedByMessage;
  }
  const parts = parseLogMessage(message);
  logPartsCache.set(log, { message, parts });
  cacheParsedMessage(message, parts);
  return parts;
}

export function buildApiResponse(ctx: AppSimulationContext): void {
  ctx.apiResponse = buildApiResponsePayload(
    ctx.playerWinner,
    ctx.opponentWinner,
    ctx.draw,
  );
}

export function simulate(ctx: AppSimulationContext, count: number = 1000): void {
  try {
    if (ctx.api) {
      runSimulation(ctx, count);
      return;
    }
    runSimulationAsync(ctx, count);
  } catch (error) {
    console.error(error);
    ctx.setStatus?.('Something went wrong, please send a bug report.', 'error');
  }
}

export function runSimulation(
  ctx: AppSimulationContext,
  count: number = 1000,
  configOverrides?: Partial<SimulationConfig>,
): void {
  ctx.simulationBattleAmt = count;
  ctx.localStorageService.setFormStorage(ctx.formGroup);

  const result = ctx.simulationService.runSimulation(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
    configOverrides,
  );

  applySimulationResult(ctx, result);
}

export function runSimulationAsync(
  ctx: AppSimulationContext,
  count: number = 1000,
): void {
  if (ctx.simulationInProgress) {
    return;
  }

  ctx.simulationBattleAmt = count;
  ctx.localStorageService.setFormStorage(ctx.formGroup);
  ctx.simulationInProgress = true;
  ctx.simulationCancelRequested = false;
  ctx.simulationProgress = 0;
  ctx.simulationProgressLabel = `0 / ${count}`;
  const runId = (ctx.simulationRunId ?? 0) + 1;
  ctx.simulationRunId = runId;
  ctx.setStatus?.('Simulation started...', 'success');
  ctx.markForCheck?.();

  const worker = ctx.simulationService.runSimulationInWorker(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
    {
      onProgress: (progress) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        const percent = progress.total
          ? Math.floor((progress.completed / progress.total) * 100)
          : 0;
        ctx.simulationProgress = percent;
        ctx.simulationProgressLabel = `${progress.completed} / ${progress.total}`;
        ctx.playerWinner = progress.playerWins;
        ctx.opponentWinner = progress.opponentWins;
        ctx.draw = progress.draws;
        ctx.markForCheck?.();
      },
      onResult: (result) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        cleanupWorker(ctx);
        applySimulationResult(ctx, result);
        ctx.simulationProgress = 100;
        ctx.simulationProgressLabel = `${count} / ${count}`;
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.setStatus?.('Simulation finished.', 'success');
        ctx.markForCheck?.();
      },
      onAborted: (result) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        cleanupWorker(ctx);
        applySimulationResult(ctx, result);
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.setStatus?.('Simulation cancelled.', 'error');
        ctx.markForCheck?.();
      },
      onError: (message) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        cleanupWorker(ctx);
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.setStatus?.(message || 'Simulation failed.', 'error');
        ctx.markForCheck?.();
      },
    },
    { progressInterval: 50 },
  );

  ctx.simulationWorker = worker;
}

export function cancelSimulation(ctx: AppSimulationContext): void {
  if (!ctx.simulationWorker || !ctx.simulationInProgress) {
    return;
  }
  // Invalidate callbacks from the currently running simulation immediately.
  ctx.simulationRunId = (ctx.simulationRunId ?? 0) + 1;
  ctx.simulationCancelRequested = true;
  ctx.setStatus?.('Cancelling simulation...', 'error');
  // Worker cancellation messages are not processed while the worker is busy in
  // a long synchronous simulation loop, so force-terminate for immediate cancel.
  ctx.simulationService.requestWorkerCancel(ctx.simulationWorker);
  cleanupWorker(ctx);
  ctx.simulationInProgress = false;
  ctx.simulationCancelRequested = false;
  ctx.setStatus?.('Simulation cancelled.', 'error');
  ctx.markForCheck?.();
}

export function optimizePositioning(
  ctx: AppSimulationContext,
  side: PositioningOptimizationSide,
  count: number = 1000,
): void {
  if (ctx.simulationInProgress) {
    return;
  }

  const maxSimulationsPerPermutation = Math.max(1, Math.trunc(count || 1));

  ctx.simulationInProgress = true;
  ctx.simulationCancelRequested = false;
  ctx.simulationProgress = 0;
  ctx.simulationProgressLabel = `0 / ${maxSimulationsPerPermutation * 120}`;
  const runId = (ctx.simulationRunId ?? 0) + 1;
  ctx.simulationRunId = runId;
  ctx.setStatus?.(
    `Optimizing ${side} positioning...`,
    'success',
  );
  ctx.markForCheck?.();

  const worker = ctx.simulationService.runPositioningOptimizationInWorker(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
    {
      onProgress: (progress) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        const percent = progress.totalBattlesEstimate
          ? Math.floor(
              (progress.completedBattles / progress.totalBattlesEstimate) * 100,
            )
          : 0;
        ctx.simulationProgress = percent;
        ctx.simulationProgressLabel =
          `${progress.completedBattles} / ${progress.totalBattlesEstimate} sims`;
        ctx.markForCheck?.();
      },
      onResult: (result) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        cleanupWorker(ctx);
        applyOptimizedLineup(ctx, result);
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.simulationProgress = 100;
        ctx.simulationProgressLabel =
          `${result.simulatedBattles} / ${result.simulatedBattles} sims`;
        const bestScorePct = (result.bestPermutation.score * 100).toFixed(1);
        ctx.setStatus?.(
          `${capitalizeSide(side)} optimized (${bestScorePct}% score). Running verification sim...`,
          'success',
        );
        ctx.markForCheck?.();
        runSimulationAsync(ctx, count);
      },
      onAborted: (result) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        cleanupWorker(ctx);
        if (result.bestPermutation) {
          applyOptimizedLineup(ctx, result);
        }
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.setStatus?.('Positioning optimization cancelled.', 'error');
        ctx.markForCheck?.();
      },
      onError: (message) => {
        if (ctx.simulationRunId !== runId) {
          return;
        }
        cleanupWorker(ctx);
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.setStatus?.(message || 'Positioning optimization failed.', 'error');
        ctx.markForCheck?.();
      },
    },
    {
      side,
      maxSimulationsPerPermutation,
      batchSize: Math.min(25, maxSimulationsPerPermutation),
      minSamplesBeforeElimination: Math.min(50, maxSimulationsPerPermutation),
      confidenceZ: 1.96,
    },
  );

  ctx.simulationWorker = worker;
}

function cleanupWorker(ctx: AppSimulationContext): void {
  if (ctx.simulationWorker) {
    ctx.simulationWorker.terminate();
  }
  ctx.simulationWorker = null;
}

function applyOptimizedLineup(
  ctx: AppSimulationContext,
  result: PositioningOptimizationResult,
): void {
  const key = result.side === 'player' ? 'playerPets' : 'opponentPets';
  const formArray = ctx.formGroup.get(key) as FormArray | null;
  if (!formArray || !result.bestPermutation) {
    return;
  }

  reorderFormArrayByLineup(formArray, result.bestPermutation.lineup);
  ctx.afterPositioningApplied?.();
}

function reorderFormArrayByLineup(
  formArray: FormArray,
  lineup: (PetConfig | null)[],
): void {
  const controls = formArray.controls.slice();
  const sourceValues = controls.map((control) => control.value);
  const usedSourceIndices = new Set<number>();

  for (let targetIndex = 0; targetIndex < controls.length; targetIndex += 1) {
    const targetPet = lineup[targetIndex] ?? null;
    const sourceIndex = findNextMatchingSourceIndex(
      sourceValues,
      targetPet,
      usedSourceIndices,
    );
    if (sourceIndex === -1) {
      continue;
    }
    usedSourceIndices.add(sourceIndex);
    formArray.setControl(targetIndex, controls[sourceIndex]);
  }
  formArray.updateValueAndValidity();
}

function findNextMatchingSourceIndex(
  sourceValues: unknown[],
  targetPet: PetConfig | null,
  usedSourceIndices: Set<number>,
): number {
  const targetSignature = buildPetSignature(targetPet);
  for (let i = 0; i < sourceValues.length; i += 1) {
    if (usedSourceIndices.has(i)) {
      continue;
    }
    if (buildPetSignature(sourceValues[i] ?? null) === targetSignature) {
      return i;
    }
  }
  return -1;
}

function buildPetSignature(pet: unknown): string {
  if (!pet || typeof pet !== 'object') {
    return 'empty';
  }
  const petRecord = pet as Record<string, unknown>;
  if (typeof petRecord.name !== 'string' || !petRecord.name) {
    return 'empty';
  }

  const rawEquipment = petRecord.equipment;
  const equipmentName =
    rawEquipment && typeof rawEquipment === 'object'
      ? typeof (rawEquipment as { name?: unknown }).name === 'string'
        ? (rawEquipment as { name: string }).name
        : null
      : rawEquipment ?? null;

  const signature = {
    name: petRecord.name ?? null,
    attack: petRecord.attack ?? null,
    health: petRecord.health ?? null,
    exp: petRecord.exp ?? null,
    equipment: equipmentName ?? null,
    equipmentUses: petRecord.equipmentUses ?? null,
    belugaSwallowedPet: petRecord.belugaSwallowedPet ?? null,
    parrotCopyPet: petRecord.parrotCopyPet ?? null,
    mana: petRecord.mana ?? null,
    triggersConsumed: petRecord.triggersConsumed ?? null,
    foodsEaten: petRecord.foodsEaten ?? null,
    battlesFought: petRecord.battlesFought ?? null,
    timesHurt: petRecord.timesHurt ?? null,
  };

  return JSON.stringify(signature);
}

function capitalizeSide(side: PositioningOptimizationSide): string {
  return side.charAt(0).toUpperCase() + side.slice(1);
}

function applySimulationResult(
  ctx: AppSimulationContext,
  result: {
    playerWins: number;
    opponentWins: number;
    draws: number;
    battles?: Battle[];
    randomDecisions?: RandomDecisionCapture[];
    randomOverrideError?: string | null;
  },
): void {
  ctx.playerWinner = result.playerWins;
  ctx.opponentWinner = result.opponentWins;
  ctx.draw = result.draws;
  ctx.battles = result.battles || [];
  const randomEventsByBattle = new Map<Battle, LogMessagePart[]>();
  ctx.battleRandomEvents = ctx.battles.map((battle) => {
    const parts = formatRandomEvents(battle, ctx.logService);
    randomEventsByBattle.set(battle, parts);
    return parts;
  });
  ctx.battleRandomEventsByBattle = randomEventsByBattle;
  refreshFilteredBattles(ctx);
  ctx.viewBattle = result.battles?.[0] || null;
  ctx.viewBattleLogs = ctx.viewBattle?.logs ?? [];
  refreshViewBattleLogRows(ctx);
  refreshViewBattleTimeline(ctx);
  ctx.diffBattleLeftIndex = 0;
  ctx.diffBattleRightIndex = ctx.battles.length > 1 ? 1 : 0;
  refreshBattleDiff(ctx);
  ctx.simulated = true;
  ctx.randomDecisions = (result.randomDecisions ?? []).filter(
    (decision) => Array.isArray(decision.options) && decision.options.length > 1,
  );
  ctx.randomOverrideError = result.randomOverrideError ?? null;
}

export function setViewBattle(ctx: AppSimulationContext, battle: Battle): void {
  ctx.viewBattle = battle;
  ctx.viewBattleLogs = ctx.viewBattle?.logs ?? [];
  refreshViewBattleLogRows(ctx);
  refreshViewBattleTimeline(ctx);
}

export function refreshViewBattleLogRows(ctx: AppSimulationContext): void {
  if (ctx.viewBattle) {
    const cached = viewBattleLogRowsCache.get(ctx.viewBattle);
    if (cached && cached.logs === ctx.viewBattleLogs) {
      ctx.viewBattleLogRows = cached.rows;
      return;
    }
  }
  const rows = ctx.viewBattleLogs.map((log) => ({
    parts: getLogMessageParts(log, ctx.logService),
    classes: [
      getPlayerClass(log),
      log.randomEvent ? 'random-event' : '',
      log.bold ? 'bold' : '',
    ].filter(Boolean),
  }));
  ctx.viewBattleLogRows = rows;
  if (ctx.viewBattle) {
    viewBattleLogRowsCache.set(ctx.viewBattle, {
      logs: ctx.viewBattleLogs,
      rows,
    });
  }
}

export function refreshViewBattleTimeline(ctx: AppSimulationContext): void {
  const logs = ctx.viewBattle?.logs ?? [];
  const triggerLogs = logs.filter(
    (log) =>
      log.type === 'ability' ||
      log.type === 'equipment' ||
      log.type === 'attack',
  );
  const sourceLogs = triggerLogs.length > 0 ? triggerLogs : logs;

  ctx.viewBattleTimelineRows = sourceLogs.map((log, index) => ({
    step: index + 1,
    source: getLogActorLabel(log, 'source'),
    target: getLogActorLabel(log, 'target'),
    reason: getTimelineReason(log),
    text: getPlainLogText(log),
    side: getLogSide(log),
  }));
}

export function setBattleDiffLeft(
  ctx: AppSimulationContext,
  battleIndex: number,
): void {
  ctx.diffBattleLeftIndex = normalizeBattleIndex(ctx, battleIndex);
  refreshBattleDiff(ctx);
}

export function setBattleDiffRight(
  ctx: AppSimulationContext,
  battleIndex: number,
): void {
  ctx.diffBattleRightIndex = normalizeBattleIndex(ctx, battleIndex);
  refreshBattleDiff(ctx);
}

export function setBattleDiffLeftScope(
  ctx: AppSimulationContext,
  scope: BattleDiffScope,
): void {
  ctx.diffBattleLeftScope = normalizeDiffScope(scope);
  refreshBattleDiff(ctx);
}

export function setBattleDiffRightScope(
  ctx: AppSimulationContext,
  scope: BattleDiffScope,
): void {
  ctx.diffBattleRightScope = normalizeDiffScope(scope);
  refreshBattleDiff(ctx);
}

export function refreshBattleDiff(ctx: AppSimulationContext): void {
  const leftIndex = normalizeBattleIndex(ctx, ctx.diffBattleLeftIndex);
  const rightIndex = normalizeBattleIndex(ctx, ctx.diffBattleRightIndex);
  ctx.diffBattleLeftIndex = leftIndex;
  ctx.diffBattleRightIndex = rightIndex;

  const leftBattle = ctx.battles[leftIndex];
  const rightBattle = ctx.battles[rightIndex];
  const leftRows = summarizeBattleForDiff(
    leftBattle,
    normalizeDiffScope(ctx.diffBattleLeftScope),
  );
  const rightRows = summarizeBattleForDiff(
    rightBattle,
    normalizeDiffScope(ctx.diffBattleRightScope),
  );
  const maxLen = Math.max(leftRows.length, rightRows.length);

  const rows: BattleDiffRow[] = [];
  const summary: BattleDiffSummary = { ...EMPTY_DIFF_SUMMARY };

  for (let i = 0; i < maxLen; i++) {
    const left = leftRows[i] ?? '';
    const right = rightRows[i] ?? '';
    const same = left === right;
    let kind: BattleDiffRow['kind'] = 'same';
    if (!same) {
      if (left && right) {
        kind = 'changed';
      } else if (left) {
        kind = 'left-only';
      } else {
        kind = 'right-only';
      }
    }
    rows.push({ step: i + 1, left, right, same, kind });

    if (same) {
      summary.equalSteps += 1;
      continue;
    }
    if (kind === 'changed') {
      summary.changedSteps += 1;
    } else if (kind === 'left-only') {
      summary.leftOnly += 1;
    } else if (kind === 'right-only') {
      summary.rightOnly += 1;
    }
  }

  ctx.battleDiffRows = rows;
  ctx.battleDiffSummary = summary;
}

export function refreshFilteredBattles(ctx: AppSimulationContext): void {
  const filter = ctx.formGroup.get('logFilter')?.value ?? null;
  ctx.filteredBattlesCache =
    filter == null
      ? ctx.battles
      : ctx.battles.filter((battle) => battle.winner === filter);
}

export function formatRandomEvents(
  battle: Battle,
  logService: LogService | null,
): LogMessagePart[] {
  const randomLogs = battle.logs.filter((log) => log.randomEvent === true);
  const parts: LogMessagePart[] = [];
  const showDebugInfo = logService?.isShowTriggerNamesInLogs() ?? false;
  randomLogs.forEach((log, index) => {
    if (showDebugInfo) {
      const reason = log.randomEventReason === 'tie-broken'
        ? 'tie-broken'
        : log.randomEventReason === 'deterministic'
          ? 'deterministic'
          : 'true random';
      parts.push({ type: 'text', text: `[${reason}] ` });
    }
    parts.push(...getLogMessageParts(log, logService));
    if (index < randomLogs.length - 1) {
      parts.push({ type: 'br' });
    }
  });
  return parts;
}

function normalizeBattleIndex(ctx: AppSimulationContext, index: number): number {
  if (!Array.isArray(ctx.battles) || ctx.battles.length === 0) {
    return 0;
  }
  if (!Number.isFinite(index)) {
    return 0;
  }
  return Math.min(Math.max(0, Math.trunc(index)), ctx.battles.length - 1);
}


export {
  BattleDiffRow,
  BattleDiffScope,
  BattleDiffSummary,
  BattleTimelineRow,
  EMPTY_DIFF_SUMMARY,
  LogMessagePart,
  getDrawPercent,
  getDrawWidth,
  getLogActorLabel,
  getLogSide,
  getLosePercent,
  getLoseWidth,
  getPlayerClass,
  getPlainLogText,
  getTimelineReason,
  getWinPercent,
  normalizeDiffScope,
  parseLogMessage,
  summarizeBattleForDiff,
} from './app.component.simulation-log';
