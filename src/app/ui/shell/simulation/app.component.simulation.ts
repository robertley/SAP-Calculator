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

export type BattleLogEventFilter =
  | 'all'
  | 'board'
  | 'attack'
  | 'ability'
  | 'equipment'
  | 'death'
  | 'random';

export interface BattleLogBadge {
  text: string;
  className: string;
}

export interface BattleLogRow {
  parts: LogMessagePart[];
  classes: string[];
  logIndex: number;
  type: Log['type'];
  typeLabel: string;
  sideLabel: 'P' | 'O' | '-';
  rawText: string;
  randomEvent: boolean;
  isBoard: boolean;
  isPhaseMarker: boolean;
  phaseTitle: string | null;
  groupId: string;
  groupTitle: string;
  badges: BattleLogBadge[];
}

export interface BattleLogGroup {
  id: string;
  title: string;
  rows: BattleLogRow[];
  collapsed: boolean;
}

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
  viewBattleLogRows: BattleLogRow[];
  viewBattleLogGroups: BattleLogGroup[];
  logEventFilter: BattleLogEventFilter;
  collapsedLogGroupIds: Set<string>;
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
  showRandomOverrides?: boolean;
  refreshFightAnimationFromViewBattle?: () => void;
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
    rows: BattleLogRow[];
    includePositionPrefix: boolean;
  }
>();
const PARSED_MESSAGE_CACHE_MAX = 1000;
type StatusTone = 'success' | 'error';

const LOG_TYPE_LABELS: Record<Log['type'], string> = {
  attack: 'Attack',
  move: 'Move',
  board: 'Board',
  death: 'Death',
  ability: 'Ability',
  equipment: 'Equipment',
  trumpets: 'Trumpets',
};

function normalizeBattleLogFilter(
  value: BattleLogEventFilter | string | null | undefined,
): BattleLogEventFilter {
  if (
    value === 'board' ||
    value === 'attack' ||
    value === 'ability' ||
    value === 'equipment' ||
    value === 'death' ||
    value === 'random'
  ) {
    return value;
  }
  return 'all';
}

function shouldShowPositionalArgsInLogs(ctx: Pick<AppSimulationContext, 'formGroup'>): boolean {
  const positionalControl = ctx.formGroup.get('showPositionalArgsInLogs');
  if (!positionalControl) {
    return true;
  }
  return positionalControl.value !== false;
}

function toCssToken(value: string): string {
  const token = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return token || 'unknown';
}

function getSideLabelFromClass(playerClass: string): 'P' | 'O' | '-' {
  if (playerClass === 'log-player') {
    return 'P';
  }
  if (playerClass === 'log-opponent') {
    return 'O';
  }
  return '-';
}

function extractPhaseTitle(rawText: string): string | null {
  const trimmed = `${rawText ?? ''}`.trim();
  if (!/^Phase\s+\d+\s*:/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function buildLogBadges(
  type: Log['type'],
  sideLabel: 'P' | 'O' | '-',
  randomEvent: boolean,
  isPhaseMarker: boolean,
): BattleLogBadge[] {
  const sideClass =
    sideLabel === 'P'
      ? 'log-badge-side-player'
      : sideLabel === 'O'
        ? 'log-badge-side-opponent'
        : 'log-badge-side-unknown';
  const badges: BattleLogBadge[] = [
    { text: sideLabel, className: `log-badge-side ${sideClass}` },
    {
      text: LOG_TYPE_LABELS[type] ?? type,
      className: `log-badge-type log-badge-type-${toCssToken(type)}`,
    },
  ];
  if (randomEvent) {
    badges.push({
      text: 'Random',
      className: 'log-badge-random',
    });
  }
  if (isPhaseMarker) {
    badges.push({
      text: 'Phase',
      className: 'log-badge-phase',
    });
  }
  return badges;
}

function matchesLogFilter(
  row: BattleLogRow,
  filter: BattleLogEventFilter,
): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'random') {
    return row.randomEvent;
  }
  return row.type === filter;
}

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

function startAsyncRun(
  ctx: AppSimulationContext,
  initialProgressLabel: string,
  statusMessage: string,
): number {
  ctx.simulationInProgress = true;
  ctx.simulationCancelRequested = false;
  ctx.simulationProgress = 0;
  ctx.simulationProgressLabel = initialProgressLabel;
  const runId = (ctx.simulationRunId ?? 0) + 1;
  ctx.simulationRunId = runId;
  ctx.setStatus?.(statusMessage, 'success');
  ctx.markForCheck?.();
  return runId;
}

function isCurrentRun(ctx: AppSimulationContext, runId: number): boolean {
  return ctx.simulationRunId === runId;
}

function endAsyncRun(
  ctx: AppSimulationContext,
  statusMessage: string,
  tone: StatusTone,
): void {
  ctx.simulationInProgress = false;
  ctx.simulationCancelRequested = false;
  ctx.setStatus?.(statusMessage, tone);
  ctx.markForCheck?.();
}

function classifyDiffKind(
  left: string,
  right: string,
): BattleDiffRow['kind'] {
  if (left === right) {
    return 'same';
  }
  if (left && right) {
    return 'changed';
  }
  if (left) {
    return 'left-only';
  }
  return 'right-only';
}

function applyDiffSummary(
  summary: BattleDiffSummary,
  kind: BattleDiffRow['kind'],
): void {
  if (kind === 'same') {
    summary.equalSteps += 1;
  } else if (kind === 'changed') {
    summary.changedSteps += 1;
  } else if (kind === 'left-only') {
    summary.leftOnly += 1;
  } else if (kind === 'right-only') {
    summary.rightOnly += 1;
  }
}

function buildLogPositionPrefix(
  log: Log,
  includePositionPrefix: boolean,
): string {
  if (!includePositionPrefix) {
    return '';
  }
  const raw = `${log.rawMessage ?? log.message ?? ''}`.replace(/<[^>]+>/g, '');
  if (/\b[PO][1-5]\b/.test(raw)) {
    return '';
  }

  const sourceLabel = buildPositionLabel(getSourceIsOpponent(log), log.sourceIndex);
  const targetLabel = buildPositionLabel(getTargetIsOpponent(log), log.targetIndex);

  if (sourceLabel && targetLabel) {
    return `[${sourceLabel}->${targetLabel}] `;
  }
  if (sourceLabel) {
    return `[${sourceLabel}] `;
  }
  if (targetLabel) {
    return `[->${targetLabel}] `;
  }
  return '';
}

function normalizePositionBracketSpacing(message: string): string {
  return message.replace(/\[([^\]]+)\]/g, (full, inner: string) => {
    const compact = `${inner ?? ''}`
      .replace(/&[a-z0-9#]+;/gi, '')
      .replace(/[\s\u200b-\u200d\u2060\ufeff]+/gi, '')
      .toUpperCase();
    if (!compact) {
      return full;
    }
    const directionalMatch = /^([PO][1-5])->([PO][1-5])$/.exec(compact);
    if (directionalMatch) {
      return `[${directionalMatch[1]}->${directionalMatch[2]}]`;
    }
    const sourceOnlyMatch = /^([PO][1-5])$/.exec(compact);
    if (sourceOnlyMatch) {
      return `[${sourceOnlyMatch[1]}]`;
    }
    const targetOnlyMatch = /^->([PO][1-5])$/.exec(compact);
    if (targetOnlyMatch) {
      return `[->${targetOnlyMatch[1]}]`;
    }
    return full;
  });
}

function buildPositionLabel(
  isOpponent: boolean | null,
  index: number | null | undefined,
): string | null {
  if (isOpponent == null || index == null || !Number.isFinite(index)) {
    return null;
  }
  const clampedIndex = Math.min(Math.max(1, Math.trunc(index)), 5);
  return `${isOpponent ? 'O' : 'P'}${clampedIndex}`;
}

function getSourceIsOpponent(log: Log): boolean | null {
  if (log.player?.isOpponent === true) {
    return true;
  }
  if (log.player?.isOpponent === false) {
    return false;
  }
  if (log.playerIsOpponent === true) {
    return true;
  }
  if (log.playerIsOpponent === false) {
    return false;
  }
  const sourceSide = log.sourcePet?.parent?.isOpponent;
  if (sourceSide === true) {
    return true;
  }
  if (sourceSide === false) {
    return false;
  }
  return null;
}

function getTargetIsOpponent(log: Log): boolean | null {
  const targetSide = log.targetPet?.parent?.isOpponent;
  if (targetSide === true) {
    return true;
  }
  if (targetSide === false) {
    return false;
  }
  if (log.targetIsOpponent === true) {
    return true;
  }
  if (log.targetIsOpponent === false) {
    return false;
  }
  return null;
}

function getLogMessageParts(
  log: Log,
  logService: LogService | null,
  includePositionPrefix: boolean,
): LogMessagePart[] {
  if (logService) {
    logService.decorateLogIfNeeded(log);
  }
  const prefix = buildLogPositionPrefix(log, includePositionPrefix);
  const message = normalizePositionBracketSpacing(
    `${prefix}${log.message}` + (log.count > 1 ? ` (x${log.count})` : ''),
  );
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

function buildBattleLogRows(
  ctx: AppSimulationContext,
  includePositionPrefix: boolean,
): BattleLogRow[] {
  let currentGroupId = 'phase-0';
  let currentGroupTitle = 'Battle';
  let phaseCount = 0;

  return ctx.viewBattleLogs.map((log, logIndex) => {
    const rawText = getPlainLogText(log);
    const phaseTitle = extractPhaseTitle(rawText);
    if (phaseTitle) {
      phaseCount += 1;
      currentGroupId = `phase-${phaseCount}`;
      currentGroupTitle = phaseTitle;
    }
    const playerClass = getPlayerClass(log);
    const sideLabel = getSideLabelFromClass(playerClass);
    const randomEvent = log.randomEvent === true;
    const isBoard = log.type === 'board';
    const isPhaseMarker = Boolean(phaseTitle);
    const typeClass = `log-type-${toCssToken(log.type)}`;
    const classes = [
      'log-entry',
      playerClass,
      typeClass,
      randomEvent ? 'random-event' : '',
      isBoard ? 'log-row-board' : '',
      isPhaseMarker ? 'log-phase-marker' : '',
    ].filter(Boolean);

    return {
      parts: getLogMessageParts(log, ctx.logService, includePositionPrefix),
      classes,
      logIndex,
      type: log.type,
      typeLabel: LOG_TYPE_LABELS[log.type] ?? log.type,
      sideLabel,
      rawText,
      randomEvent,
      isBoard,
      isPhaseMarker,
      phaseTitle,
      groupId: currentGroupId,
      groupTitle: currentGroupTitle,
      badges: buildLogBadges(log.type, sideLabel, randomEvent, isPhaseMarker),
    };
  });
}

export function refreshViewBattleLogGroups(ctx: AppSimulationContext): void {
  ctx.logEventFilter = normalizeBattleLogFilter(ctx.logEventFilter);
  if (!ctx.collapsedLogGroupIds) {
    ctx.collapsedLogGroupIds = new Set<string>();
  }
  const filter = ctx.logEventFilter;
  const collapsedGroupIds = ctx.collapsedLogGroupIds;
  const groups: BattleLogGroup[] = [];
  const groupsById = new Map<string, BattleLogGroup>();

  for (const row of ctx.viewBattleLogRows) {
    if (!matchesLogFilter(row, filter)) {
      continue;
    }
    let group = groupsById.get(row.groupId);
    if (!group) {
      group = {
        id: row.groupId,
        title: row.groupTitle,
        rows: [],
        collapsed: collapsedGroupIds.has(row.groupId),
      };
      groupsById.set(row.groupId, group);
      groups.push(group);
    }
    group.rows.push(row);
  }

  ctx.viewBattleLogGroups = groups;
}

export function setViewBattleLogFilter(
  ctx: AppSimulationContext,
  filter: BattleLogEventFilter,
): void {
  ctx.logEventFilter = normalizeBattleLogFilter(filter);
  refreshViewBattleLogGroups(ctx);
  ctx.markForCheck?.();
}

export function toggleViewBattleLogGroup(
  ctx: AppSimulationContext,
  groupId: string,
): void {
  if (!groupId) {
    return;
  }
  if (!ctx.collapsedLogGroupIds) {
    ctx.collapsedLogGroupIds = new Set<string>();
  }
  if (ctx.collapsedLogGroupIds.has(groupId)) {
    ctx.collapsedLogGroupIds.delete(groupId);
  } else {
    ctx.collapsedLogGroupIds.add(groupId);
  }
  refreshViewBattleLogGroups(ctx);
  ctx.markForCheck?.();
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
  const runId = startAsyncRun(ctx, `0 / ${count}`, 'Simulation started...');

  const worker = ctx.simulationService.runSimulationInWorker(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
    {
      onProgress: (progress) => {
        if (!isCurrentRun(ctx, runId)) {
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
        if (!isCurrentRun(ctx, runId)) {
          return;
        }
        cleanupWorker(ctx);
        applySimulationResult(ctx, result);
        ctx.simulationProgress = 100;
        ctx.simulationProgressLabel = `${count} / ${count}`;
        endAsyncRun(ctx, 'Simulation finished.', 'success');
      },
      onAborted: (result) => {
        if (!isCurrentRun(ctx, runId)) {
          return;
        }
        cleanupWorker(ctx);
        applySimulationResult(ctx, result);
        endAsyncRun(ctx, 'Simulation cancelled.', 'error');
      },
      onError: (message) => {
        if (!isCurrentRun(ctx, runId)) {
          return;
        }
        cleanupWorker(ctx);
        endAsyncRun(ctx, message || 'Simulation failed.', 'error');
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

  const runId = startAsyncRun(
    ctx,
    `0 / ${maxSimulationsPerPermutation * 120}`,
    `Optimizing ${side} positioning...`,
  );

  const worker = ctx.simulationService.runPositioningOptimizationInWorker(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
    {
      onProgress: (progress) => {
        if (!isCurrentRun(ctx, runId)) {
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
        if (!isCurrentRun(ctx, runId)) {
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
        if (!isCurrentRun(ctx, runId)) {
          return;
        }
        cleanupWorker(ctx);
        if (result.bestPermutation) {
          applyOptimizedLineup(ctx, result);
        }
        endAsyncRun(ctx, 'Positioning optimization cancelled.', 'error');
      },
      onError: (message) => {
        if (!isCurrentRun(ctx, runId)) {
          return;
        }
        cleanupWorker(ctx);
        endAsyncRun(
          ctx,
          message || 'Positioning optimization failed.',
          'error',
        );
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
  const includePositionPrefix = shouldShowPositionalArgsInLogs(ctx);
  const randomEventsByBattle = new Map<Battle, LogMessagePart[]>();
  ctx.battleRandomEvents = ctx.battles.map((battle) => {
    const parts = formatRandomEvents(
      battle,
      ctx.logService,
      includePositionPrefix,
    );
    randomEventsByBattle.set(battle, parts);
    return parts;
  });
  ctx.battleRandomEventsByBattle = randomEventsByBattle;
  refreshFilteredBattles(ctx);
  ctx.viewBattle = result.battles?.[0] || null;
  ctx.viewBattleLogs = ctx.viewBattle?.logs ?? [];
  ctx.collapsedLogGroupIds = new Set<string>();
  refreshViewBattleLogRows(ctx);
  refreshViewBattleTimeline(ctx);
  ctx.refreshFightAnimationFromViewBattle?.();
  ctx.diffBattleLeftIndex = 0;
  ctx.diffBattleRightIndex = ctx.battles.length > 1 ? 1 : 0;
  refreshBattleDiff(ctx);
  ctx.simulated = true;
  ctx.randomDecisions = (result.randomDecisions ?? []).filter(
    (decision) => Array.isArray(decision.options) && decision.options.length > 1,
  );
  ctx.randomOverrideError = result.randomOverrideError ?? null;
  ctx.showRandomOverrides = ctx.randomDecisions.length > 0;
}

export function setViewBattle(ctx: AppSimulationContext, battle: Battle): void {
  ctx.viewBattle = battle;
  ctx.viewBattleLogs = ctx.viewBattle?.logs ?? [];
  refreshViewBattleLogRows(ctx);
  refreshViewBattleTimeline(ctx);
  ctx.refreshFightAnimationFromViewBattle?.();
}

export function refreshViewBattleLogRows(ctx: AppSimulationContext): void {
  const includePositionPrefix = shouldShowPositionalArgsInLogs(ctx);
  if (ctx.viewBattle) {
    const cached = viewBattleLogRowsCache.get(ctx.viewBattle);
    if (
      cached &&
      cached.logs === ctx.viewBattleLogs &&
      cached.includePositionPrefix === includePositionPrefix
    ) {
      ctx.viewBattleLogRows = cached.rows;
      refreshViewBattleLogGroups(ctx);
      return;
    }
  }
  const rows = buildBattleLogRows(ctx, includePositionPrefix);
  ctx.viewBattleLogRows = rows;
  refreshViewBattleLogGroups(ctx);
  if (ctx.viewBattle) {
    viewBattleLogRowsCache.set(ctx.viewBattle, {
      logs: ctx.viewBattleLogs,
      rows,
      includePositionPrefix,
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
    const kind = classifyDiffKind(left, right);
    const same = kind === 'same';
    rows.push({ step: i + 1, left, right, same, kind });
    applyDiffSummary(summary, kind);
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
  includePositionPrefix = false,
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
    parts.push(...getLogMessageParts(log, logService, includePositionPrefix));
    if (index < randomLogs.length - 1) {
      parts.push({ type: 'br' });
    }
  });
  return parts;
}

export function refreshDebugLogPresentation(ctx: AppSimulationContext): void {
  const includePositionPrefix = shouldShowPositionalArgsInLogs(ctx);
  const randomEventsByBattle = new Map<Battle, LogMessagePart[]>();
  ctx.battleRandomEvents = (ctx.battles ?? []).map((battle) => {
    const parts = formatRandomEvents(
      battle,
      ctx.logService,
      includePositionPrefix,
    );
    randomEventsByBattle.set(battle, parts);
    return parts;
  });
  ctx.battleRandomEventsByBattle = randomEventsByBattle;
  refreshViewBattleLogRows(ctx);
  ctx.refreshFightAnimationFromViewBattle?.();
  ctx.markForCheck?.();
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
