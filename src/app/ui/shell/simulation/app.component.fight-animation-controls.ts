import {
  FightAnimationDeath,
  FightAnimationFrame,
  FightAnimationPopup,
  buildFightAnimationFrames,
} from './app.component.fight-animation';

export interface AppFightAnimationContext {
  fightAnimationFrames: FightAnimationFrame[];
  fightAnimationFrameIndex: number;
  fightAnimationPlaying: boolean;
  fightAnimationSpeed: number;
  fightAnimationTimer: ReturnType<typeof setTimeout> | null;
  viewBattleLogs: Array<{ message?: string | null }>;
  markForCheck: () => void;
}

export function refreshFightAnimationFromViewBattle(
  ctx: AppFightAnimationContext,
): void {
  pauseFightAnimation(ctx, false);
  ctx.fightAnimationFrames = buildFightAnimationFrames(
    ctx.viewBattleLogs as Parameters<typeof buildFightAnimationFrames>[0],
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
  const normalized = speed === 0.5 || speed === 2 ? speed : 1;
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
  const intervalMs = Math.max(120, Math.round(700 / ctx.fightAnimationSpeed));
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
