import {
  getSoundVolume,
  isSoundMuted,
  setSoundMuted as persistSoundMuted,
  setSoundVolume as persistSoundVolume,
} from 'app/runtime/sound-preferences';

export interface AppSoundStateContext {
  soundMuted: boolean;
  soundMenuOpen: boolean;
  soundVolume: number;
  markForCheck: () => void;
}

export function loadSoundPreference(ctx: AppSoundStateContext): void {
  ctx.soundMuted = isSoundMuted();
  ctx.soundVolume = getSoundVolume();
}

export function toggleSoundMuted(ctx: AppSoundStateContext): void {
  ctx.soundMuted = !ctx.soundMuted;
  if (!ctx.soundMuted && ctx.soundVolume <= 0) {
    ctx.soundVolume = 0.5;
    persistSoundVolume(ctx.soundVolume);
  }
  persistSoundMuted(ctx.soundMuted);
  ctx.markForCheck();
}

export function toggleSoundMenu(ctx: AppSoundStateContext): void {
  ctx.soundMenuOpen = !ctx.soundMenuOpen;
  ctx.markForCheck();
}

export function setSoundVolume(
  ctx: AppSoundStateContext,
  value: number | string,
): void {
  const parsed = Number(value);
  const normalized = Number.isFinite(parsed)
    ? Math.min(1, Math.max(0, parsed))
    : 1;
  ctx.soundVolume = normalized;
  persistSoundVolume(normalized);
  if (normalized <= 0 && !ctx.soundMuted) {
    ctx.soundMuted = true;
    persistSoundMuted(true);
  } else if (normalized > 0 && ctx.soundMuted) {
    ctx.soundMuted = false;
    persistSoundMuted(false);
  }
  ctx.markForCheck();
}
