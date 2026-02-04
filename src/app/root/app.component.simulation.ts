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
  simulated: boolean;
  apiResponse: string | null;
  api?: boolean;
  simulationInProgress?: boolean;
  simulationProgress?: number;
  simulationProgressLabel?: string;
  simulationWorker?: Worker | null;
  simulationCancelRequested?: boolean;
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
  ctx.setStatus?.('Simulation started...', 'success');
  ctx.markForCheck?.();

  const worker = ctx.simulationService.runSimulationInWorker(
    ctx.formGroup,
    count,
    ctx.player,
    ctx.opponent,
    {
      onProgress: (progress) => {
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
        cleanupWorker(ctx);
        applySimulationResult(ctx, result);
        ctx.simulationProgress = 100;
        ctx.simulationProgressLabel = `${count} / ${count}`;
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.markForCheck?.();
      },
      onAborted: (result) => {
        cleanupWorker(ctx);
        applySimulationResult(ctx, result);
        ctx.simulationInProgress = false;
        ctx.simulationCancelRequested = false;
        ctx.setStatus?.('Simulation cancelled.', 'error');
        ctx.markForCheck?.();
      },
      onError: (message) => {
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
  ctx.simulationCancelRequested = true;
  ctx.setStatus?.('Cancelling simulation...', 'error');
  ctx.simulationService.requestWorkerCancel(ctx.simulationWorker);
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
  ctx.simulated = true;
}

export function setViewBattle(ctx: AppSimulationContext, battle: Battle): void {
  ctx.viewBattle = battle;
  ctx.viewBattleLogs = ctx.viewBattle?.logs ?? [];
  refreshViewBattleLogRows(ctx);
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
  randomLogs.forEach((log, index) => {
    parts.push(...getLogMessageParts(log, logService));
    if (index < randomLogs.length - 1) {
      parts.push({ type: 'br' });
    }
  });
  return parts;
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
