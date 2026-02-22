import {
  FightAnimationDeath,
  FightAnimationFrame,
  FightAnimationPopup,
  FightAnimationSlot,
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

export interface FightAnimationSlotRenderModel {
  slot: FightAnimationSlot;
  classMap: Record<string, boolean>;
  shiftSteps: number | null;
  popups: FightAnimationPopup[];
  death: FightAnimationDeath | null;
}

export interface FightAnimationRenderFrameModel {
  frame: FightAnimationFrame;
  phase: 'a' | 'b';
  playerSlots: FightAnimationSlotRenderModel[];
  opponentSlots: FightAnimationSlotRenderModel[];
}

const DEFAULT_FIGHT_ANIMATION_SPEED = 1;
const EMPTY_POPUPS: FightAnimationPopup[] = [];

export function refreshFightAnimationFromViewBattle(
  ctx: AppFightAnimationContext,
): void {
  pauseFightAnimation(ctx, false);
  const includePositionPrefix = Boolean(
    ctx.formGroup.get('showTriggerNamesInLogs')?.value,
  ) && Boolean(ctx.formGroup.get('showPositionalArgsInLogs')?.value ?? true);
  ctx.fightAnimationFrames = buildFightAnimationFrames(
    ctx.viewBattleLogs as Parameters<typeof buildFightAnimationFrames>[0],
    { includePositionPrefix, includeBoardFrames: false },
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

export function buildFightAnimationRenderFrame(
  frame: FightAnimationFrame,
  frameIndex: number,
): FightAnimationRenderFrameModel {
  const phase: 'a' | 'b' = frameIndex % 2 === 0 ? 'a' : 'b';
  const popupsBySlot = new Map<string, FightAnimationPopup[]>();
  const shiftStepsBySlot = new Map<string, number>();
  const shiftedSlots = new Set<string>();

  for (const popup of frame.popups) {
    const key = slotKey(popup.side, popup.slot);
    const existing = popupsBySlot.get(key);
    if (existing) {
      existing.push(popup);
    } else {
      popupsBySlot.set(key, [popup]);
    }
  }

  for (const shift of frame.shifts) {
    const key = slotKey(shift.side, shift.slot);
    shiftedSlots.add(key);
    shiftStepsBySlot.set(key, Math.max(1, shift.fromSlot - shift.slot));
  }

  const attackerKey = frame.impact
    ? slotKey(frame.impact.attackerSide, frame.impact.attackerSlot)
    : null;
  const targetKey = frame.impact
    ? slotKey(frame.impact.targetSide, frame.impact.targetSlot)
    : null;
  const deathKey = frame.death ? slotKey(frame.death.side, frame.death.slot) : null;
  const visibleDeathKey =
    deathKey && !shiftedSlots.has(deathKey) ? deathKey : null;

  const toSlotRenderModel = (
    slot: FightAnimationSlot,
  ): FightAnimationSlotRenderModel => {
    const key = slotKey(slot.side, slot.slot);
    const popups = popupsBySlot.get(key) ?? EMPTY_POPUPS;
    const hasStatGain = popups.some(
      (popup) => popup.type !== 'damage' && popup.delta > 0,
    );
    return {
      slot,
      classMap: {
        'fight-slot-front': slot.slot === 0,
        'fight-slot-empty-card': slot.isEmpty,
        'fight-slot-attacker': attackerKey === key,
        'fight-slot-target': targetKey === key,
        'fight-slot-shifted': shiftedSlots.has(key),
        'fight-slot-stat-gain': hasStatGain,
        'fight-impact-phase-a': phase === 'a',
        'fight-impact-phase-b': phase === 'b',
      },
      shiftSteps: shiftStepsBySlot.get(key) ?? null,
      popups,
      death: visibleDeathKey === key ? frame.death : null,
    };
  };

  return {
    frame,
    phase,
    playerSlots: frame.playerSlots.map(toSlotRenderModel),
    opponentSlots: frame.opponentSlots.map(toSlotRenderModel),
  };
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

export function isFightStatGainSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): boolean {
  const popups = getCurrentFightAnimationFrame(ctx)?.popups ?? [];
  return popups.some(
    (popup) =>
      popup.side === side &&
      popup.slot === slot &&
      popup.type !== 'damage' &&
      popup.delta > 0,
  );
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
  const frame = getCurrentFightAnimationFrame(ctx);
  const death = frame?.death;
  if (!death) {
    return false;
  }
  if (
    frame?.shifts?.some((shift) => shift.side === side && shift.slot === slot)
  ) {
    return false;
  }
  return death.side === side && death.slot === slot;
}

export function getFightDeathForSlot(
  ctx: AppFightAnimationContext,
  side: 'player' | 'opponent',
  slot: number,
): FightAnimationDeath | null {
  const frame = getCurrentFightAnimationFrame(ctx);
  const death = frame?.death;
  if (!death) {
    return null;
  }
  if (death.side !== side || death.slot !== slot) {
    return null;
  }
  if (
    frame?.shifts?.some((shift) => shift.side === side && shift.slot === slot)
  ) {
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

function slotKey(side: 'player' | 'opponent', slot: number): string {
  return `${side}:${slot}`;
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
