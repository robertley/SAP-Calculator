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

export function mergeReplayImageCalculatorState(
  fallback: ReplayCalculatorState,
  exact: Partial<ReplayCalculatorState> | null,
): ReplayCalculatorState {
  if (!exact) {
    return fallback;
  }
  return {
    ...fallback,
    ...exact,
    playerPets: normalizeLineup(exact.playerPets) ?? fallback.playerPets,
    opponentPets:
      normalizeLineup(exact.opponentPets) ?? fallback.opponentPets,
  };
}
