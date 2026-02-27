const SOUND_MUTED_STORAGE_KEY = 'sapSoundMuted';
const SOUND_VOLUME_STORAGE_KEY = 'sapSoundVolume';
const DEFAULT_SOUND_VOLUME = 1;

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function isSoundMuted(): boolean {
  if (!hasLocalStorage()) {
    return false;
  }
  try {
    return window.localStorage.getItem(SOUND_MUTED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean): void {
  if (!hasLocalStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(
      SOUND_MUTED_STORAGE_KEY,
      muted ? 'true' : 'false',
    );
  } catch {
    // Ignore storage write failures.
  }
}

export function getSoundVolume(): number {
  if (!hasLocalStorage()) {
    return DEFAULT_SOUND_VOLUME;
  }
  try {
    const raw = window.localStorage.getItem(SOUND_VOLUME_STORAGE_KEY);
    if (raw == null || raw === '') {
      return DEFAULT_SOUND_VOLUME;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return DEFAULT_SOUND_VOLUME;
    }
    return Math.min(1, Math.max(0, parsed));
  } catch {
    return DEFAULT_SOUND_VOLUME;
  }
}

export function setSoundVolume(volume: number): void {
  if (!hasLocalStorage()) {
    return;
  }
  const normalized = Number.isFinite(volume)
    ? Math.min(1, Math.max(0, volume))
    : DEFAULT_SOUND_VOLUME;
  try {
    window.localStorage.setItem(SOUND_VOLUME_STORAGE_KEY, String(normalized));
  } catch {
    // Ignore storage write failures.
  }
}
