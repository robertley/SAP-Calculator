import {
  FightAnimationDeath,
  FightAnimationFrame,
  FightAnimationPopup,
  buildFightAnimationFrames,
} from './app.component.fight-animation';
import { FormGroup } from '@angular/forms';

export interface AppFightAnimationContext {
  fightAnimationFrames: FightAnimationFrame[];
  fightAnimationFrameIndex: number;
  fightAnimationPlaying: boolean;
  fightAnimationSpeed: number;
  fightAnimationTimer: ReturnType<typeof setTimeout> | null;
  viewBattleLogs: Array<{ message?: string | null }>;
  formGroup: FormGroup;
  markForCheck: () => void;
}

const DEFAULT_FIGHT_ANIMATION_SPEED = 1;

export function refreshFightAnimationFromViewBattle(
  ctx: AppFightAnimationContext,
): void {
  pauseFightAnimation(ctx, false);
  const includePositionPrefix = Boolean(
    ctx.formGroup.get('showTriggerNamesInLogs')?.value,
  ) && Boolean(ctx.formGroup.get('showPositionalArgsInLogs')?.value ?? true);
  ctx.fightAnimationFrames = buildFightAnimationFrames(
    ctx.viewBattleLogs as Parameters<typeof buildFightAnimationFrames>[0],
    { includePositionPrefix },
  );
  ctx.fightAnimationFrameIndex = ctx.fightAnimationFrames.length > 0 ? 0 : -1;
  ctx.markForCheck();
}

export function toggleFightAnimationPlayback(
  ctx: AppFightAnimationContext,
): void {
  if (ctx.fightAnimationFrames.length === 0) {
    return;
  }
  if (ctx.fightAnimationPlaying) {
    pauseFightAnimation(ctx);
    return;
  }
  playFightAnimation(ctx);
}

export function resetFightAnimation(ctx: AppFightAnimationContext): void {
  pauseFightAnimation(ctx, false);
  if (ctx.fightAnimationFrames.length === 0) {
    ctx.fightAnimationFrameIndex = -1;
    ctx.markForCheck();
    return;
  }
  ctx.fightAnimationFrameIndex = 0;
  ctx.markForCheck();
}

export function stepFightAnimation(
  ctx: AppFightAnimationContext,
  delta: number,
): void {
  pauseFightAnimation(ctx, false);
  if (ctx.fightAnimationFrames.length === 0) {
    ctx.fightAnimationFrameIndex = -1;
    ctx.markForCheck();
    return;
  }
  const maxIndex = ctx.fightAnimationFrames.length - 1;
  const normalizedDelta = Number.isFinite(delta) ? Math.trunc(delta) : 0;
  const next = Math.min(
    maxIndex,
    Math.max(0, ctx.fightAnimationFrameIndex + normalizedDelta),
  );
  ctx.fightAnimationFrameIndex = next;
  ctx.markForCheck();
}

export function setFightAnimationSpeed(
  ctx: AppFightAnimationContext,
  speed: number,
): void {
  const normalized = normalizeFightAnimationSpeed(speed);
  if (ctx.fightAnimationSpeed === normalized) {
    return;
  }
  ctx.fightAnimationSpeed = normalized;
  if (ctx.fightAnimationPlaying) {
    scheduleFightAnimationTick(ctx);
  }
  ctx.markForCheck();
}

export function onFightAnimationScrub(
  ctx: AppFightAnimationContext,
  rawValue: string | number,
): void {
  if (ctx.fightAnimationFrames.length === 0) {
    return;
  }
  const parsed = typeof rawValue === 'number' ? rawValue : Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return;
  }
  pauseFightAnimation(ctx, false);
  const maxIndex = ctx.fightAnimationFrames.length - 1;
  ctx.fightAnimationFrameIndex = Math.min(maxIndex, Math.max(0, Math.trunc(parsed)));
  ctx.markForCheck();
}

export function isFightAttackerSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): boolean {
  const impact = getCurrentFightAnimationFrame(ctx)?.impact;
  if (!impact) {
    return false;
  }
  return impact.attackerSide === side && impact.attackerSlot === slot;
}

export function isFightTargetSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): boolean {
  const impact = getCurrentFightAnimationFrame(ctx)?.impact;
  if (!impact) {
    return false;
  }
  return impact.targetSide === side && impact.targetSlot === slot;
}

export function getFightPopupsForSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): FightAnimationPopup[] {
  const popups = getCurrentFightAnimationFrame(ctx)?.popups ?? [];
  return popups.filter((popup) => popup.side === side && popup.slot === slot);
}

export function getFightPopupText(popup: FightAnimationPopup): string {
  const absDelta = Math.abs(popup.delta);
  const sign = popup.delta > 0 ? '+' : '-';
  return `${sign}${absDelta}`;
}

export function isFightDeathSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): boolean {
  const death = getCurrentFightAnimationFrame(ctx)?.death;
  if (!death) {
    return false;
  }
  return death.side === side && death.slot === slot;
}

export function getFightDeathForSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): FightAnimationDeath | null {
  const death = getCurrentFightAnimationFrame(ctx)?.death;
  if (!death) {
    return null;
  }
  if (death.side !== side || death.slot !== slot) {
    return null;
  }
  return death;
}

export function isFightShiftedSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): boolean {
  const shifts = getCurrentFightAnimationFrame(ctx)?.shifts ?? [];
  return shifts.some((shift) => shift.side === side && shift.slot === slot);
}

export function getFightShiftSteps(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): number {
  const shifts = getCurrentFightAnimationFrame(ctx)?.shifts ?? [];
  const shift = shifts.find((item) => item.side === side && item.slot === slot);
  if (!shift) {
    return 0;
  }
  return Math.max(1, shift.fromSlot - shift.slot);
}

export function clearFightAnimationTimer(ctx: AppFightAnimationContext): void {
  if (!ctx.fightAnimationTimer) {
    return;
  }
  clearTimeout(ctx.fightAnimationTimer);
  ctx.fightAnimationTimer = null;
}

function playFightAnimation(ctx: AppFightAnimationContext): void {
  if (ctx.fightAnimationFrames.length === 0) {
    ctx.fightAnimationFrameIndex = -1;
    ctx.fightAnimationPlaying = false;
    clearFightAnimationTimer(ctx);
    ctx.markForCheck();
    return;
  }

  const maxIndex = ctx.fightAnimationFrames.length - 1;
  if (ctx.fightAnimationFrameIndex < 0 || ctx.fightAnimationFrameIndex > maxIndex) {
    ctx.fightAnimationFrameIndex = 0;
  }
  if (ctx.fightAnimationFrameIndex >= maxIndex) {
    ctx.fightAnimationFrameIndex = 0;
  }

  ctx.fightAnimationPlaying = true;
  scheduleFightAnimationTick(ctx);
  ctx.markForCheck();
}

function pauseFightAnimation(
  ctx: AppFightAnimationContext,
  markForCheck: boolean = true,
): void {
  ctx.fightAnimationPlaying = false;
  clearFightAnimationTimer(ctx);
  if (markForCheck) {
    ctx.markForCheck();
  }
}

function scheduleFightAnimationTick(ctx: AppFightAnimationContext): void {
  clearFightAnimationTimer(ctx);
  if (!ctx.fightAnimationPlaying) {
    return;
  }
  const intervalMs = getFightAnimationIntervalMs(ctx);
  ctx.fightAnimationTimer = setTimeout(() => {
    ctx.fightAnimationTimer = null;
    advanceFightAnimationTick(ctx);
  }, intervalMs);
}

function advanceFightAnimationTick(ctx: AppFightAnimationContext): void {
  if (!ctx.fightAnimationPlaying || ctx.fightAnimationFrames.length === 0) {
    pauseFightAnimation(ctx, false);
    return;
  }
  const maxIndex = ctx.fightAnimationFrames.length - 1;
  if (ctx.fightAnimationFrameIndex >= maxIndex) {
    pauseFightAnimation(ctx);
    return;
  }
  ctx.fightAnimationFrameIndex += 1;
  ctx.markForCheck();
  scheduleFightAnimationTick(ctx);
}

function getCurrentFightAnimationFrame(
  ctx: AppFightAnimationContext,
): FightAnimationFrame | null {
  if (
    ctx.fightAnimationFrameIndex < 0 ||
    ctx.fightAnimationFrameIndex >= ctx.fightAnimationFrames.length
  ) {
    return null;
  }
  return ctx.fightAnimationFrames[ctx.fightAnimationFrameIndex] ?? null;
}

function normalizeFightAnimationSpeed(speed: number): number {
  if (speed === 0.5 || speed === 1 || speed === 1.5 || speed === 2) {
    return speed;
  }
  return DEFAULT_FIGHT_ANIMATION_SPEED;
}

function getFightAnimationIntervalMs(ctx: AppFightAnimationContext): number {
  const frame = getCurrentFightAnimationFrame(ctx);
  const speed = normalizeFightAnimationSpeed(ctx.fightAnimationSpeed);
  const baseMs = getFightAnimationBaseIntervalMs(frame);
  return Math.max(120, Math.round(baseMs / speed));
}

function getFightAnimationBaseIntervalMs(
  frame: FightAnimationFrame | null,
): number {
  if (!frame) {
    return 680;
  }

  let baseMs = 480;
  if (frame.type === 'board') {
    baseMs = 240;
  } else if (frame.type === 'attack') {
    baseMs = 760;
  } else if (frame.type === 'death') {
    baseMs = 680;
  } else if (frame.type === 'ability' || frame.type === 'equipment') {
    baseMs = 620;
  } else if (frame.type === 'move') {
    baseMs = 560;
  }

  if (frame.randomEvent) {
    baseMs += 90;
  }

  if (frame.impact || frame.death || frame.popups.length > 0) {
    baseMs = Math.max(baseMs, 720);
  }

  return baseMs;
}
