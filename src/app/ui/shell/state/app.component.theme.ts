import {
  DARK_BATTLE_BACKGROUNDS,
  LIGHT_BATTLE_BACKGROUNDS,
} from '../view/app.ui.constants';

export interface AppThemeStateContext {
  theme: 'light' | 'dark';
  battleBackgrounds: string[];
  setRandomBackground: () => void;
  markForCheck: () => void;
}

const UI_THEME_STORAGE_KEY = 'sapTheme';

export function loadThemePreference(ctx: AppThemeStateContext): void {
  const savedTheme = window.localStorage.getItem(UI_THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(ctx, savedTheme, false);
    return;
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')
    ?.matches;
  applyTheme(ctx, prefersDark ? 'dark' : 'light', false);
}

export function toggleTheme(ctx: AppThemeStateContext): void {
  applyTheme(ctx, ctx.theme === 'dark' ? 'light' : 'dark', true);
}

export function applyTheme(
  ctx: AppThemeStateContext,
  theme: 'light' | 'dark',
  persist: boolean,
): void {
  ctx.theme = theme;
  ctx.battleBackgrounds =
    theme === 'dark'
      ? [...DARK_BATTLE_BACKGROUNDS]
      : [...LIGHT_BATTLE_BACKGROUNDS];
  ctx.setRandomBackground();
  document.documentElement.setAttribute('data-bs-theme', theme);
  document.body.classList.toggle('theme-dark', theme === 'dark');
  if (persist) {
    window.localStorage.setItem(UI_THEME_STORAGE_KEY, theme);
  }
  ctx.markForCheck();
}
