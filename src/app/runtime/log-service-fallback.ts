import type { LogService } from 'app/integrations/log.service';

const FALLBACK_LOG_SERVICE = {
  setEnabled: () => {},
  isEnabled: () => false,
  setDeferDecorations: () => {},
  isDeferDecorations: () => true,
  setShowTriggerNamesInLogs: () => {},
  isShowTriggerNamesInLogs: () => false,
  setDebugSummonBoardStateLogs: () => {},
  isDebugSummonBoardStateLogs: () => false,
  decorateLogIfNeeded: () => {},
  createLog: () => {},
  getLogs: (): unknown[] => [],
  reset: () => {},
  printState: () => {},
} as unknown as LogService;

export function coerceLogService(
  logService: LogService | null | undefined,
): LogService {
  return logService ?? FALLBACK_LOG_SERVICE;
}

export function installLogServiceFallback(target: object): void {
  const targetWithLog = target as { logService?: LogService | null };
  let currentLogService = coerceLogService(targetWithLog.logService);
  Object.defineProperty(target, 'logService', {
    configurable: true,
    enumerable: true,
    get: () => currentLogService,
    set: (value: LogService | null | undefined) => {
      currentLogService = coerceLogService(value);
    },
  });
}
