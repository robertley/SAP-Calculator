import { PetConfig } from 'app/domain/interfaces/simulation-config.interface';
import { ReplayCalculatorState } from './replay-calc-parser';

export const REPLAY_IMAGE_CALCULATOR_STATES_KEY =
  'calculatorStatesByTurn';

export type ReplayImageCalculatorStatesByTurn = Record<
  string,
  Partial<ReplayCalculatorState>
>;

export function getReplayImageCalculatorState(
  payload: Record<string, unknown>,
  turn: number,
): Partial<ReplayCalculatorState> | null {
  const rawStates = payload[REPLAY_IMAGE_CALCULATOR_STATES_KEY];
  if (!rawStates || typeof rawStates !== 'object' || Array.isArray(rawStates)) {
    return null;
  }
  const state = (rawStates as Record<string, unknown>)[String(turn)];
  return state && typeof state === 'object' && !Array.isArray(state)
    ? (state as Partial<ReplayCalculatorState>)
    : null;
}

function normalizeLineup(
  lineup: (PetConfig | null)[] | undefined,
): (PetConfig | null)[] | undefined {
  return lineup?.map((pet) =>
    pet
      ? {
          attack: 0,
          health: 0,
          exp: 0,
          ...pet,
          equipment: pet.equipment ? { ...pet.equipment } : null,
        }
      : null,
  );
}

function lineupIdentityScore(
  left: (PetConfig | null)[] | undefined,
  right: (PetConfig | null)[] | undefined,
): number {
  const remaining = (right ?? [])
    .map((pet) => pet?.name?.trim().toLowerCase() ?? '')
    .filter(Boolean);
  return (left ?? []).reduce((score, pet) => {
    const name = pet?.name?.trim().toLowerCase() ?? '';
    if (!name) {
      return score;
    }
    const matchIndex = remaining.indexOf(name);
    if (matchIndex < 0) {
      return score;
    }
    remaining.splice(matchIndex, 1);
    return score + 1;
  }, 0);
}

const SIDE_FIELD_PAIRS: ReadonlyArray<
  readonly [keyof ReplayCalculatorState, keyof ReplayCalculatorState]
> = [
  ['playerPack', 'opponentPack'],
  ['playerToy', 'opponentToy'],
  ['playerToyLevel', 'opponentToyLevel'],
  ['playerHardToy', 'opponentHardToy'],
  ['playerHardToyLevel', 'opponentHardToyLevel'],
  ['playerGoldSpent', 'opponentGoldSpent'],
  ['playerRollAmount', 'opponentRollAmount'],
  ['playerSummonedAmount', 'opponentSummonedAmount'],
  ['playerLevel3Sold', 'opponentLevel3Sold'],
  ['playerTransformationAmount', 'opponentTransformationAmount'],
  ['playerPets', 'opponentPets'],
];

export function orientReplayImageCalculatorState(
  fallback: ReplayCalculatorState,
  exact: Partial<ReplayCalculatorState>,
): Partial<ReplayCalculatorState> {
  if (!exact.playerPets || !exact.opponentPets) {
    return exact;
  }
  const directScore =
    lineupIdentityScore(exact.playerPets, fallback.playerPets) +
    lineupIdentityScore(exact.opponentPets, fallback.opponentPets);
  const swappedScore =
    lineupIdentityScore(exact.playerPets, fallback.opponentPets) +
    lineupIdentityScore(exact.opponentPets, fallback.playerPets);
  if (swappedScore <= directScore || swappedScore === 0) {
    return exact;
  }

  const oriented = { ...exact } as Record<string, unknown>;
  const source = exact as Record<string, unknown>;
  SIDE_FIELD_PAIRS.forEach(([playerKey, opponentKey]) => {
    const hasPlayer = Object.prototype.hasOwnProperty.call(source, playerKey);
    const hasOpponent = Object.prototype.hasOwnProperty.call(source, opponentKey);
    if (hasOpponent) {
      oriented[playerKey] = source[opponentKey];
    } else {
      delete oriented[playerKey];
    }
    if (hasPlayer) {
      oriented[opponentKey] = source[playerKey];
    } else {
      delete oriented[opponentKey];
    }
  });
  return oriented as Partial<ReplayCalculatorState>;
}

export function mergeReplayImageCalculatorState(
  fallback: ReplayCalculatorState,
  exact: Partial<ReplayCalculatorState> | null,
): ReplayCalculatorState {
  if (!exact) {
    return fallback;
  }
  const oriented = orientReplayImageCalculatorState(fallback, exact);
  const customPacks = oriented.customPacks ?? fallback.customPacks;
  const customPackNames = new Set(customPacks.map((pack) => pack.name));
  const resolvePackSelection = (
    exactSelection: string | undefined,
    fallbackSelection: string,
  ): string => {
    if (
      customPackNames.has(fallbackSelection) &&
      (!exactSelection || !customPackNames.has(exactSelection))
    ) {
      return fallbackSelection;
    }
    return exactSelection ?? fallbackSelection;
  };
  return {
    ...fallback,
    ...oriented,
    customPacks,
    playerPack: resolvePackSelection(
      oriented.playerPack,
      fallback.playerPack,
    ),
    opponentPack: resolvePackSelection(
      oriented.opponentPack,
      fallback.opponentPack,
    ),
    playerPets: normalizeLineup(oriented.playerPets) ?? fallback.playerPets,
    opponentPets:
      normalizeLineup(oriented.opponentPets) ?? fallback.opponentPets,
  };
}
