import {
  RandomDecisionCapture,
  RandomDecisionOverride,
  SimulationConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import { LogMessagePart } from './app.component.simulation';
import { decorateRandomDecisionTextParts } from './random-decision-decorate';

export interface AppRandomDecisionContext {
  simulationInProgress: boolean;
  randomDecisions: RandomDecisionCapture[];
  randomOverrideError: string | null;
  randomDecisionSelectionByFingerprint: Record<string, string>;
  randomDecisionPartsCache: Map<string, LogMessagePart[]>;
  runSimulation: (
    count?: number,
    configOverrides?: Partial<SimulationConfig>,
  ) => void;
  setStatus: (message: string, tone?: 'success' | 'error') => void;
  markForCheck: () => void;
}

export function captureRandomEvents(ctx: AppRandomDecisionContext): void {
  if (ctx.simulationInProgress) {
    return;
  }
  runSingleBattleDecisionCapture(ctx, [], true);
  syncRandomDecisionSelectionMap(ctx, ctx.randomDecisions, []);
  if (ctx.randomDecisions.length === 0) {
    ctx.setStatus('No random decisions captured in this battle.', 'error');
    return;
  }
  ctx.setStatus(
    `Captured ${ctx.randomDecisions.length} random decision(s).`,
    'success',
  );
}

export function clearRandomOverrides(ctx: AppRandomDecisionContext): void {
  ctx.randomDecisionSelectionByFingerprint = {};
  ctx.randomDecisions = [];
  ctx.randomOverrideError = null;
  ctx.markForCheck();
}

export function runForcedRandomSimulation(ctx: AppRandomDecisionContext): void {
  if (ctx.simulationInProgress) {
    return;
  }
  const previousDecisions = [...ctx.randomDecisions];
  const overrides = buildRandomDecisionOverrides(ctx);
  runSingleBattleDecisionCapture(ctx, overrides, false);
  syncRandomDecisionSelectionMap(ctx, ctx.randomDecisions, previousDecisions);
  if (ctx.randomOverrideError) {
    ctx.setStatus(ctx.randomOverrideError, 'error');
    return;
  }
  ctx.setStatus('Forced simulation completed.', 'success');
}

export function onRandomDecisionChoiceChanged(
  ctx: AppRandomDecisionContext,
  decision: RandomDecisionCapture,
  optionId: string,
): void {
  const fingerprint = getDecisionFingerprint(decision);
  ctx.randomDecisionSelectionByFingerprint = {
    ...ctx.randomDecisionSelectionByFingerprint,
    [fingerprint]: optionId,
  };
  refreshConditionalRandomDecisions(ctx);
}

export function getRandomDecisionLabelParts(
  ctx: AppRandomDecisionContext,
  decision: RandomDecisionCapture,
): LogMessagePart[] {
  const key = `label:${decision.key}:${decision.label}`;
  const cached = ctx.randomDecisionPartsCache.get(key);
  if (cached) {
    return cached;
  }
  const parts = decorateRandomDecisionTextParts(decision.label);
  ctx.randomDecisionPartsCache.set(key, parts);
  return parts;
}

export function getRandomDecisionSelectedOptionParts(
  ctx: AppRandomDecisionContext,
  decision: RandomDecisionCapture,
): LogMessagePart[] {
  const selectedId = getSelectedRandomDecisionOptionId(ctx, decision);
  const selectedOption =
    decision.options.find((option) => option.id === selectedId) ??
    decision.options[0];
  const optionLabel = selectedOption?.label ?? '';
  const key = `option:${decision.key}:${optionLabel}`;
  const cached = ctx.randomDecisionPartsCache.get(key);
  if (cached) {
    return cached;
  }
  const parts = decorateRandomDecisionTextParts(optionLabel);
  ctx.randomDecisionPartsCache.set(key, parts);
  return parts;
}

export function getSelectedRandomDecisionOptionId(
  ctx: AppRandomDecisionContext,
  decision: RandomDecisionCapture,
): string {
  const fingerprint = getDecisionFingerprint(decision);
  const selected =
    ctx.randomDecisionSelectionByFingerprint[fingerprint] ??
    decision.selectedOptionId ??
    decision.options[0]?.id ??
    '';
  if (!decision.options.some((option) => option.id === selected)) {
    return decision.selectedOptionId ?? decision.options[0]?.id ?? '';
  }
  return selected;
}

function refreshConditionalRandomDecisions(
  ctx: AppRandomDecisionContext,
): void {
  if (ctx.simulationInProgress || ctx.randomDecisions.length === 0) {
    return;
  }
  const previousDecisions = [...ctx.randomDecisions];
  const overrides = buildRandomDecisionOverrides(ctx);
  runSingleBattleDecisionCapture(ctx, overrides, false);
  syncRandomDecisionSelectionMap(ctx, ctx.randomDecisions, previousDecisions);
}

function runSingleBattleDecisionCapture(
  ctx: AppRandomDecisionContext,
  randomDecisionOverrides: RandomDecisionOverride[],
  strictRandomOverrideValidation: boolean,
): void {
  ctx.runSimulation(1, {
    logsEnabled: true,
    simulationCount: 1,
    maxLoggedBattles: 1,
    captureRandomDecisions: true,
    randomDecisionOverrides,
    strictRandomOverrideValidation,
  });
}

function buildRandomDecisionOverrides(
  ctx: AppRandomDecisionContext,
): RandomDecisionOverride[] {
  const overrides: RandomDecisionOverride[] = [];
  for (const decision of ctx.randomDecisions) {
    const selected = getSelectedRandomDecisionOptionId(ctx, decision);
    if (!selected) {
      continue;
    }
    overrides.push({
      index: decision.index,
      optionId: selected,
      key: decision.key,
      label: decision.label,
    });
  }
  return overrides;
}

function getDecisionFingerprint(decision: RandomDecisionCapture): string {
  return `${decision.key}::${decision.label}`;
}

function syncRandomDecisionSelectionMap(
  ctx: AppRandomDecisionContext,
  nextDecisions: RandomDecisionCapture[],
  previousDecisions: RandomDecisionCapture[],
): void {
  const previousByFingerprint = new Map<string, string>(
    Object.entries(ctx.randomDecisionSelectionByFingerprint),
  );
  for (const decision of previousDecisions) {
    const fingerprint = getDecisionFingerprint(decision);
    const value =
      previousByFingerprint.get(fingerprint) ?? decision.selectedOptionId ?? null;
    if (!value) {
      continue;
    }
    previousByFingerprint.set(fingerprint, value);
  }

  const nextMap: Record<string, string> = {};
  for (const decision of nextDecisions) {
    const fingerprint = getDecisionFingerprint(decision);
    const fromPrevious = previousByFingerprint.get(fingerprint);
    const fallback = decision.selectedOptionId ?? decision.options[0]?.id ?? '';
    const candidate = fromPrevious ?? fallback;
    if (!decision.options.some((option) => option.id === candidate)) {
      if (fallback) {
        nextMap[fingerprint] = fallback;
      }
      continue;
    }
    nextMap[fingerprint] = candidate;
  }
  ctx.randomDecisionSelectionByFingerprint = nextMap;
}
