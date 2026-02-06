import { FormGroup } from '@angular/forms';
import { Player } from '../classes/player.class';
import { Battle } from '../interfaces/battle.interface';
import { Log } from '../interfaces/log.interface';
import { LocalStorageService } from '../services/local-storage.service';
import { LogService } from '../services/log.service';
import { SimulationService } from '../services/simulation/simulation.service';
import { money_round } from '../util/helper-functions';
import { buildApiResponse as buildApiResponsePayload } from './app.component.share-utils';

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
  setStatus?: (message: string, tone?: 'success' | 'error') => void;
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
): void {
  const logsEnabledControl = ctx.formGroup.get('logsEnabled');
  const wantsLogs = logsEnabledControl?.value ?? true;
  ctx.simulationBattleAmt = count;
  ctx.localStorageService.setFormStorage(ctx.formGroup);

  const result = ctx.simulationService.runSimulation(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
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

function cleanupWorker(ctx: AppSimulationContext): void {
  if (ctx.simulationWorker) {
    ctx.simulationWorker.terminate();
  }
  ctx.simulationWorker = null;
}

function applySimulationResult(
  ctx: AppSimulationContext,
  result: { playerWins: number; opponentWins: number; draws: number; battles?: Battle[] },
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
      const reason = getRandomEventReasonLabel(log);
      parts.push({ type: 'text', text: `[${reason}] ` });
    }
    parts.push(...getLogMessageParts(log, logService));
    if (index < randomLogs.length - 1) {
      parts.push({ type: 'br' });
    }
  });
  return parts;
}

function getRandomEventReasonLabel(log: Log): string {
  if (log.randomEventReason === 'tie-broken') {
    return 'tie-broken';
  }
  if (log.randomEventReason === 'deterministic') {
    return 'deterministic';
  }
  return 'true random';
}

function getPlainLogText(log: Log): string {
  const raw = (log.rawMessage ?? log.message ?? '').replace(/<[^>]+>/g, '');
  const countSuffix = log.count && log.count > 1 ? ` (x${log.count})` : '';
  return `${raw}${countSuffix}`.trim();
}

function getLogActorLabel(log: Log, side: 'source' | 'target'): string {
  const index = side === 'source' ? log.sourceIndex : log.targetIndex;
  const pet = side === 'source' ? log.sourcePet : log.targetPet;
  if (index != null) {
    const isOpponent =
      pet?.parent?.isOpponent ??
      (side === 'source'
        ? log.player?.isOpponent
        : log.targetPet?.parent?.isOpponent);
    const prefix = isOpponent ? 'O' : 'P';
    const petName = pet?.name ? ` ${pet.name}` : '';
    return `${prefix}${index}${petName}`;
  }
  if (pet?.name) {
    return pet.name;
  }
  if (side === 'source' && log.player) {
    return log.player.isOpponent ? 'Opponent' : 'Player';
  }
  return '-';
}

function getTimelineReason(log: Log): string {
  if (log.randomEvent === true) {
    return getRandomEventReasonLabel(log);
  }
  return 'deterministic';
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

function summarizeBattleForDiff(
  battle: Battle | undefined,
  scope: BattleDiffScope,
): string[] {
  const logs = (battle?.logs ?? []).filter((log) => {
    if (scope === 'all') {
      return true;
    }
    const side = getLogSide(log);
    return side === scope;
  });
  return logs.map((log) => {
    const source = getLogActorLabel(log, 'source');
    const target = getLogActorLabel(log, 'target');
    const reason = getTimelineReason(log);
    return `${log.type} | ${source} -> ${target} | ${reason} | ${getPlainLogText(log)}`;
  });
}

function getLogSide(log: Log): 'player' | 'opponent' | 'unknown' {
  if (log.player) {
    return log.player.isOpponent ? 'opponent' : 'player';
  }
  if (log.playerIsOpponent === true) {
    return 'opponent';
  }
  if (log.playerIsOpponent === false) {
    return 'player';
  }
  return 'unknown';
}

function normalizeDiffScope(
  scope: BattleDiffScope | string | null | undefined,
): BattleDiffScope {
  if (scope === 'player' || scope === 'opponent') {
    return scope;
  }
  return 'all';
}

export function getPlayerClass(log: Log): string {
  if (log.player == null) {
    if (log.playerIsOpponent === true) {
      return 'log-opponent';
    }
    if (log.playerIsOpponent === false) {
      return 'log-player';
    }
    return 'log';
  }
  if (!log.player.isOpponent) {
    return 'log-player';
  }
  return 'log-opponent';
}

export function getWinPercent(ctx: AppSimulationContext): number {
  const totalBattles = ctx.playerWinner + ctx.opponentWinner + ctx.draw;
  if (totalBattles === 0) return 0;
  return money_round((ctx.playerWinner / totalBattles) * 100);
}

export function getDrawPercent(ctx: AppSimulationContext): number {
  const totalBattles = ctx.playerWinner + ctx.opponentWinner + ctx.draw;
  if (totalBattles === 0) return 0;
  return money_round((ctx.draw / totalBattles) * 100);
}

export function getLosePercent(ctx: AppSimulationContext): number {
  const totalBattles = ctx.playerWinner + ctx.opponentWinner + ctx.draw;
  if (totalBattles === 0) return 0;
  return money_round((ctx.opponentWinner / totalBattles) * 100);
}

export function getDrawWidth(ctx: AppSimulationContext): string {
  return `${getLosePercent(ctx) + getDrawPercent(ctx)}%`;
}

export function getLoseWidth(ctx: AppSimulationContext): string {
  return `${getLosePercent(ctx)}%`;
}

export type LogMessagePart =
  | { type: 'text'; text: string }
  | { type: 'img'; src: string; alt: string }
  | { type: 'br' };

export interface BattleTimelineRow {
  step: number;
  source: string;
  target: string;
  reason: string;
  text: string;
  side: 'player' | 'opponent' | 'unknown';
}

export interface BattleDiffRow {
  step: number;
  left: string;
  right: string;
  same: boolean;
  kind: 'same' | 'changed' | 'left-only' | 'right-only';
}

export interface BattleDiffSummary {
  equalSteps: number;
  changedSteps: number;
  leftOnly: number;
  rightOnly: number;
}

export type BattleDiffScope = 'all' | 'player' | 'opponent';

const EMPTY_DIFF_SUMMARY: BattleDiffSummary = {
  equalSteps: 0,
  changedSteps: 0,
  leftOnly: 0,
  rightOnly: 0,
};

export function parseLogMessage(message: string): LogMessagePart[] {
  const parts: LogMessagePart[] = [];
  const imgRegex = /<img\b[^>]*>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const normalizedMessage = injectStatIcons(message);

  while ((match = imgRegex.exec(normalizedMessage))) {
    const before = normalizedMessage.slice(lastIndex, match.index);
    pushTextParts(parts, before);

    const imgTag = match[0];
    const srcMatch = /src=["']([^"']+)["']/i.exec(imgTag);
    const altMatch = /alt=["']([^"']*)["']/i.exec(imgTag);
    parts.push({
      type: 'img',
      src: srcMatch?.[1] ?? '',
      alt: altMatch?.[1] ?? '',
    });

    lastIndex = match.index + imgTag.length;
  }

  pushTextParts(parts, normalizedMessage.slice(lastIndex));
  return parts;
}

function pushTextParts(parts: LogMessagePart[], text: string): void {
  if (!text) {
    return;
  }

  const normalized = text.replace(/<br\s*\/?>/gi, '\n');
  const stripped = normalized.replace(/<[^>]+>/g, '');
  const segments = stripped.split('\n');
  segments.forEach((segment, index) => {
    if (segment) {
      parts.push({ type: 'text', text: segment });
    }
    if (index < segments.length - 1) {
      parts.push({ type: 'br' });
    }
  });
}

const ATTACK_ICON_SRC =
  'assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/fist.png';
const HEALTH_ICON_SRC =
  'assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/heart.png';
const ATTACK_ICON_TAG = `<img src="${ATTACK_ICON_SRC}" alt="Attack" />`;
const HEALTH_ICON_TAG = `<img src="${HEALTH_ICON_SRC}" alt="Health" />`;
const ATTACK_REGEX = /\battack(?:s|ed|ing)?\b/gi;
const HEALTH_REGEX = /\bhealth\b/gi;

function injectStatIcons(message: string): string {
  return message
    .split(/(<[^>]+>)/g)
    .map((segment) => {
      if (segment.startsWith('<')) {
        return segment;
      }
      const withAttackIcons = segment.replace(ATTACK_REGEX, (match, offset) => {
        const before = segment.slice(0, offset);
        if (/\bjump[-\s]?$/i.test(before)) {
          return match;
        }
        return `${ATTACK_ICON_TAG} ${match}`;
      });
      return withAttackIcons.replace(
        HEALTH_REGEX,
        `${HEALTH_ICON_TAG} $&`,
      );
    })
    .join('');
}
