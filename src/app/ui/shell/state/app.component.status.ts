export type AppStatusTone = 'success' | 'error';

export interface AppStatusStateContext {
  statusMessage: string;
  statusTone: AppStatusTone;
  markForCheck: () => void;
}

export interface AppStatusStateController {
  setStatus: (message: string, tone?: AppStatusTone) => void;
  clearStatus: () => void;
  dispose: () => void;
}

export function createStatusStateController(
  ctx: AppStatusStateContext,
): AppStatusStateController {
  let statusTimer: ReturnType<typeof setTimeout> | null = null;

  const clearStatusTimer = (): void => {
    if (!statusTimer) {
      return;
    }
    clearTimeout(statusTimer);
    statusTimer = null;
  };

  const clearStatus = (): void => {
    clearStatusTimer();
    ctx.statusMessage = '';
    ctx.markForCheck();
  };

  const setStatus = (
    message: string,
    tone: AppStatusTone = 'success',
  ): void => {
    ctx.statusMessage = message;
    ctx.statusTone = tone;
    ctx.markForCheck();
    clearStatusTimer();
    statusTimer = setTimeout(() => {
      ctx.statusMessage = '';
      statusTimer = null;
      ctx.markForCheck();
    }, 3000);
  };

  const dispose = (): void => {
    clearStatusTimer();
  };

  return { setStatus, clearStatus, dispose };
}
