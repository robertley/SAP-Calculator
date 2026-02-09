import { Battle } from 'app/domain/interfaces/battle.interface';
import { Log } from 'app/domain/interfaces/log.interface';
import { roundUpToCents } from 'app/runtime/rounding';
import type { AppSimulationContext } from './app.component.simulation';

function getRandomEventReasonLabel(log: Log): string {
  if (log.randomEventReason === 'tie-broken') {
    return 'tie-broken';
  }
  if (log.randomEventReason === 'deterministic') {
    return 'deterministic';
  }
  return 'true random';
}

export function getPlainLogText(log: Log): string {
  const raw = (log.rawMessage ?? log.message ?? '').replace(/<[^>]+>/g, '');
  const countSuffix = log.count && log.count > 1 ? ` (x${log.count})` : '';
  return `${raw}${countSuffix}`.trim();
}

export function getLogActorLabel(log: Log, side: 'source' | 'target'): string {
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

export function getTimelineReason(log: Log): string {
  if (log.randomEvent === true) {
    return getRandomEventReasonLabel(log);
  }
  return 'deterministic';
}

export function summarizeBattleForDiff(
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

export function getLogSide(log: Log): 'player' | 'opponent' | 'unknown' {
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

export function normalizeDiffScope(
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
  return roundUpToCents((ctx.playerWinner / totalBattles) * 100);
}

export function getDrawPercent(ctx: AppSimulationContext): number {
  const totalBattles = ctx.playerWinner + ctx.opponentWinner + ctx.draw;
  if (totalBattles === 0) return 0;
  return roundUpToCents((ctx.draw / totalBattles) * 100);
}

export function getLosePercent(ctx: AppSimulationContext): number {
  const totalBattles = ctx.playerWinner + ctx.opponentWinner + ctx.draw;
  if (totalBattles === 0) return 0;
  return roundUpToCents((ctx.opponentWinner / totalBattles) * 100);
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

export const EMPTY_DIFF_SUMMARY: BattleDiffSummary = {
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







