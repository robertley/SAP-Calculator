import { FormGroup } from '@angular/forms';
import { Player } from 'app/domain/entities/player.class';

export interface AppKeyboardShortcutContext {
  api: boolean;
  formGroup: FormGroup;
  simulationInProgress: boolean;
  undoState: unknown;
  player: Player;
  opponent: Player;
  optimizePositioning: (side: 'player' | 'opponent') => void;
  simulate: (count?: number) => void;
  randomize: (player?: Player) => void;
  undoRandomize: () => void;
  toggleAdvanced: () => void;
  toggleTheme: () => void;
  setStatus: (message: string, tone?: 'success' | 'error') => void;
}

export function handleGlobalKeyboardShortcuts(
  ctx: AppKeyboardShortcutContext,
  event: KeyboardEvent,
): void {
  if (ctx.api || !ctx.formGroup || isEditableTarget(event.target)) {
    return;
  }
  if (!event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  const key = event.key.toLowerCase();
  switch (key) {
    case 's':
      if (ctx.simulationInProgress) {
        return;
      }
      ctx.simulate(ctx.formGroup.get('simulations')?.value ?? 1000);
      event.preventDefault();
      return;
    case 'r':
      if (ctx.simulationInProgress) {
        return;
      }
      ctx.randomize();
      event.preventDefault();
      return;
    case 'u':
      if (!ctx.undoState) {
        return;
      }
      ctx.undoRandomize();
      event.preventDefault();
      return;
    case 'p':
      if (ctx.simulationInProgress) {
        return;
      }
      ctx.optimizePositioning('player');
      event.preventDefault();
      return;
    case 'o':
      if (ctx.simulationInProgress) {
        return;
      }
      ctx.optimizePositioning('opponent');
      event.preventDefault();
      return;
    case 'a':
      ctx.toggleAdvanced();
      event.preventDefault();
      return;
    case 't':
      ctx.toggleTheme();
      event.preventDefault();
      return;
    case 'h':
      ctx.setStatus(
        'Shortcuts: Alt+S Simulate, Alt+R Randomize, Alt+P/O Optimize, Alt+A Scenario, Alt+T Theme.',
      );
      event.preventDefault();
      return;
    default:
      return;
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }
  if (element.isContentEditable) {
    return true;
  }
  const tagName = element.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
}
