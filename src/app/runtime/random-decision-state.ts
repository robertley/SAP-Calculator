import {
  RandomDecisionCapture,
  RandomDecisionOption,
  RandomDecisionOverride,
} from 'app/domain/interfaces/simulation-config.interface';

interface RandomDecisionSession {
  capture: boolean;
  strictValidation: boolean;
  overridesByIndex: Map<number, string>;
  overridesByFingerprint: Map<string, string>;
  decisions: RandomDecisionCapture[];
  invalidOverrideError: string | null;
}

export interface RandomChoiceRequest {
  key: string;
  label: string;
  options: RandomDecisionOption[];
}

export interface RandomChoiceResult {
  index: number;
  randomEvent: boolean;
  forced: boolean;
}

function getDecisionFingerprint(key: string, label: string): string {
  return `${key}::${label}`;
}

let activeSession: RandomDecisionSession | null = null;

function sanitizeOptionId(value: string | null | undefined, index: number): string {
  const normalized = (value ?? '').trim();
  return normalized.length > 0 ? normalized : `option-${index + 1}`;
}

export function startRandomDecisionSession(options?: {
  capture?: boolean;
  strictValidation?: boolean;
  overrides?: RandomDecisionOverride[] | null;
}): void {
  const overridesByIndex = new Map<number, string>();
  const overridesByFingerprint = new Map<string, string>();
  for (const override of options?.overrides ?? []) {
    if (!override || !Number.isFinite(override.index)) {
      continue;
    }
    const normalizedIndex = Math.trunc(override.index);
    if (normalizedIndex < 0) {
      continue;
    }
    const optionId = `${override.optionId ?? ''}`.trim();
    if (!optionId) {
      continue;
    }
    const key = `${override.key ?? ''}`.trim();
    const label = `${override.label ?? ''}`.trim();
    if (key && label) {
      overridesByFingerprint.set(getDecisionFingerprint(key, label), optionId);
    }
    overridesByIndex.set(normalizedIndex, optionId);
  }
  activeSession = {
    capture: Boolean(options?.capture),
    strictValidation: options?.strictValidation !== false,
    overridesByIndex,
    overridesByFingerprint,
    decisions: [],
    invalidOverrideError: null,
  };
}

export function finishRandomDecisionSession(): {
  decisions: RandomDecisionCapture[];
  invalidOverrideError: string | null;
} {
  const result = {
    decisions: activeSession?.decisions ?? [],
    invalidOverrideError: activeSession?.invalidOverrideError ?? null,
  };
  activeSession = null;
  return result;
}

export function chooseRandomOption(
  request: RandomChoiceRequest,
  randomIndexFactory: () => number,
): RandomChoiceResult {
  const options = request.options.map((option, index) => ({
    id: sanitizeOptionId(option?.id, index),
    label: option?.label ?? option?.id ?? `Option ${index + 1}`,
  }));
  if (options.length === 0) {
    return { index: -1, randomEvent: false, forced: false };
  }
  if (options.length === 1) {
    return { index: 0, randomEvent: false, forced: false };
  }

  const session = activeSession;
  const isActuallyRandom = true;
  const shouldTrack =
    Boolean(session) &&
    isActuallyRandom &&
    (session.capture ||
      session.overridesByIndex.size > 0 ||
      session.overridesByFingerprint.size > 0);
  const decisionIndex = session?.decisions.length ?? -1;
  const decisionFingerprint = getDecisionFingerprint(request.key, request.label);
  const forcedOptionId =
    session && decisionIndex >= 0
      ? session.overridesByFingerprint.get(decisionFingerprint) ??
        session.overridesByIndex.get(decisionIndex) ??
        null
      : null;

  let selectedIndex = randomIndexFactory();
  let forced = false;

  if (forcedOptionId) {
    const forcedIndex = options.findIndex((option) => option.id === forcedOptionId);
    if (forcedIndex >= 0) {
      selectedIndex = forcedIndex;
      forced = true;
    } else if (session) {
      if (session.strictValidation) {
        const error = `Random override invalid at step ${decisionIndex + 1}: "${forcedOptionId}" not found for ${request.label}.`;
        session.invalidOverrideError = error;
        throw new Error(error);
      }
    }
  }

  if (selectedIndex < 0 || selectedIndex >= options.length) {
    selectedIndex = Math.max(0, Math.min(options.length - 1, selectedIndex));
  }

  if (shouldTrack && session) {
    session.decisions.push({
      index: decisionIndex,
      key: request.key,
      label: request.label,
      options,
      selectedOptionId: options[selectedIndex]?.id ?? null,
      forced,
    });
  }

  return {
    index: selectedIndex,
    randomEvent: isActuallyRandom,
    forced,
  };
}
