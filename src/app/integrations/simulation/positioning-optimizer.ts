import {
  PetConfig,
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';

export type PositioningOptimizationSide = 'player' | 'opponent';

export interface PositioningOptimizerOptions {
  side: PositioningOptimizationSide;
  maxSimulationsPerPermutation: number;
  batchSize: number;
  confidenceZ: number;
  minSamplesBeforeElimination: number;
  baseSeed: number;
}

export interface PositioningOptimizerProgress {
  completedBattles: number;
  totalBattlesEstimate: number;
  testedPermutations: number;
  activePermutations: number;
  bestScore: number;
}

export interface PositioningPermutationStats {
  order: number[];
  lineup: (PetConfig | null)[];
  simulations: number;
  wins: number;
  draws: number;
  losses: number;
  score: number;
  lowerBound: number;
  upperBound: number;
  eliminated: boolean;
}

export interface PositioningOptimizationResult {
  side: PositioningOptimizationSide;
  totalPermutations: number;
  prunedPermutations: number;
  simulatedBattles: number;
  aborted: boolean;
  bestPermutation: PositioningPermutationStats;
  rankedPermutations: PositioningPermutationStats[];
}

interface CandidateState extends PositioningPermutationStats {
  rounds: number;
  simulationLineup: (PetConfig | null)[];
}

interface RunPositioningOptimizationParams {
  baseConfig: SimulationConfig;
  options: Partial<PositioningOptimizerOptions> & {
    side: PositioningOptimizationSide;
  };
  shouldAbort?: () => boolean;
  onProgress?: (progress: PositioningOptimizerProgress) => void;
  simulateBatch: (config: SimulationConfig) => SimulationResult;
  projectEndTurnLineup?: (params: {
    baseConfig: SimulationConfig;
    side: PositioningOptimizationSide;
    lineup: (PetConfig | null)[];
  }) => (PetConfig | null)[];
}

const DEFAULT_MAX_SIMULATIONS_PER_PERMUTATION = 250;
const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_CONFIDENCE_Z = 1.96;
const DEFAULT_MIN_SAMPLES_BEFORE_ELIMINATION = 50;
const DEFAULT_BASE_SEED = 123456789;

export function runPositioningOptimization(
  params: RunPositioningOptimizationParams,
): PositioningOptimizationResult {
  const {
    baseConfig,
    simulateBatch,
    shouldAbort,
    onProgress,
    projectEndTurnLineup,
  } = params;
  const side = params.options.side;

  const maxSimulationsPerPermutation = Math.max(
    1,
    Math.trunc(
      params.options.maxSimulationsPerPermutation ??
        baseConfig.simulationCount ??
        DEFAULT_MAX_SIMULATIONS_PER_PERMUTATION,
    ),
  );
  const batchSize = Math.max(
    1,
    Math.trunc(params.options.batchSize ?? DEFAULT_BATCH_SIZE),
  );
  const confidenceZ =
    params.options.confidenceZ != null &&
    Number.isFinite(params.options.confidenceZ)
      ? Math.max(0, params.options.confidenceZ)
      : DEFAULT_CONFIDENCE_Z;
  const minSamplesBeforeElimination = Math.max(
    1,
    Math.trunc(
      params.options.minSamplesBeforeElimination ??
        DEFAULT_MIN_SAMPLES_BEFORE_ELIMINATION,
    ),
  );
  const baseSeed =
    params.options.baseSeed != null && Number.isFinite(params.options.baseSeed)
      ? Math.trunc(params.options.baseSeed)
      : baseConfig.seed != null && Number.isFinite(baseConfig.seed)
        ? Math.trunc(baseConfig.seed)
        : DEFAULT_BASE_SEED;

  const petsKey = side === 'player' ? 'playerPets' : 'opponentPets';
  const sidePets = (baseConfig[petsKey] ?? []).slice();
  const baselineLineupDeltas = projectEndTurnLineup
    ? computeLineupNumericDeltas(
        sidePets,
        normalizeLineupLength(
          projectEndTurnLineup({
            baseConfig,
            side,
            lineup: sidePets,
          }),
          sidePets.length,
        ),
      )
    : null;
  const permutations = generateIndexPermutations(sidePets);
  const candidates: CandidateState[] = permutations.map((order) => ({
    order: [...order],
    lineup: applyOrder(sidePets, order),
    simulations: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    score: 0,
    lowerBound: 0,
    upperBound: 1,
    eliminated: false,
    rounds: 0,
    simulationLineup: baselineLineupDeltas
      ? buildProjectedCandidateLineup(
          baseConfig,
          side,
          sidePets,
          order,
          baselineLineupDeltas,
          projectEndTurnLineup,
        )
      : applyOrder(sidePets, order),
  }));

  let completedBattles = 0;
  const totalBattlesEstimate = permutations.length * maxSimulationsPerPermutation;
  let round = 0;
  let aborted = false;

  if (candidates.length === 0) {
    throw new Error('Could not generate any board permutations.');
  }

  while (true) {
    if (shouldAbort?.()) {
      aborted = true;
      break;
    }

    const activeCandidates = candidates.filter((candidate) => !candidate.eliminated);
    if (activeCandidates.length <= 1) {
      break;
    }

    const seedForRound = baseSeed + round;
    let ranAnyBatch = false;

    for (const candidate of activeCandidates) {
      if (shouldAbort?.()) {
        aborted = true;
        break;
      }

      if (candidate.simulations >= maxSimulationsPerPermutation) {
        continue;
      }

      const remaining = maxSimulationsPerPermutation - candidate.simulations;
      const simulationsToRun = Math.min(batchSize, remaining);
      if (simulationsToRun <= 0) {
        continue;
      }

      ranAnyBatch = true;
      const batchConfig = {
        ...baseConfig,
        [petsKey]: candidate.simulationLineup,
        simulationCount: simulationsToRun,
        logsEnabled: false,
        maxLoggedBattles: 0,
        captureRandomDecisions: false,
        randomDecisionOverrides: [],
        seed: seedForRound,
      } as SimulationConfig;

      const result = simulateBatch(batchConfig);
      const objectiveWins =
        side === 'player' ? result.playerWins : result.opponentWins;
      const objectiveLosses =
        side === 'player' ? result.opponentWins : result.playerWins;
      candidate.simulations += simulationsToRun;
      candidate.rounds += 1;
      candidate.wins += objectiveWins;
      candidate.draws += result.draws;
      candidate.losses += objectiveLosses;
      updateCandidateStats(candidate, confidenceZ);
      completedBattles += simulationsToRun;

      const testedPermutations = candidates.filter((entry) => entry.simulations > 0)
        .length;
      const bestScore = Math.max(...candidates.map((entry) => entry.score));
      onProgress?.({
        completedBattles,
        totalBattlesEstimate,
        testedPermutations,
        activePermutations: candidates.filter((entry) => !entry.eliminated).length,
        bestScore,
      });
    }

    if (aborted) {
      break;
    }

    if (!ranAnyBatch) {
      break;
    }

    const activeAfterRound = candidates.filter((candidate) => !candidate.eliminated);
    for (const candidate of activeAfterRound) {
      updateCandidateStats(candidate, confidenceZ);
    }

    const eligibleForElimination = activeAfterRound.filter(
      (candidate) => candidate.simulations >= minSamplesBeforeElimination,
    );
    if (eligibleForElimination.length > 1) {
      const bestLowerBound = Math.max(
        ...eligibleForElimination.map((candidate) => candidate.lowerBound),
      );
      for (const candidate of eligibleForElimination) {
        if (candidate.upperBound < bestLowerBound) {
          candidate.eliminated = true;
        }
      }
    }

    round += 1;
  }

  for (const candidate of candidates) {
    updateCandidateStats(candidate, confidenceZ);
  }

  const rankedPermutations = [...candidates].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if (right.lowerBound !== left.lowerBound) {
      return right.lowerBound - left.lowerBound;
    }
    if (right.simulations !== left.simulations) {
      return right.simulations - left.simulations;
    }
    return 0;
  });

  const bestPermutation = rankedPermutations[0];
  if (!bestPermutation) {
    throw new Error('Positioning optimization failed to rank candidates.');
  }

  return {
    side,
    totalPermutations: candidates.length,
    prunedPermutations: candidates.filter((candidate) => candidate.eliminated)
      .length,
    simulatedBattles: completedBattles,
    aborted,
    bestPermutation: cloneCandidateStats(bestPermutation),
    rankedPermutations: rankedPermutations.map(cloneCandidateStats),
  };
}

function cloneCandidateStats(candidate: CandidateState): PositioningPermutationStats {
  return {
    order: [...candidate.order],
    lineup: [...candidate.lineup],
    simulations: candidate.simulations,
    wins: candidate.wins,
    draws: candidate.draws,
    losses: candidate.losses,
    score: candidate.score,
    lowerBound: candidate.lowerBound,
    upperBound: candidate.upperBound,
    eliminated: candidate.eliminated,
  };
}

function updateCandidateStats(candidate: CandidateState, zScore: number): void {
  const simulations = candidate.simulations;
  if (simulations <= 0) {
    candidate.score = 0;
    candidate.lowerBound = 0;
    candidate.upperBound = 1;
    return;
  }

  const score = scoreFromTallies(candidate.wins, candidate.draws, simulations);
  const variance = Math.max(0, score * (1 - score));
  const margin = zScore * Math.sqrt(variance / simulations);
  candidate.score = score;
  candidate.lowerBound = Math.max(0, score - margin);
  candidate.upperBound = Math.min(1, score + margin);
}

function scoreFromTallies(
  wins: number,
  draws: number,
  simulations: number,
): number {
  if (simulations <= 0) {
    return 0;
  }
  return (wins + draws * 0.5) / simulations;
}

function applyOrder<T>(source: T[], order: number[]): T[] {
  return order.map((index) => source[index]);
}

function buildProjectedCandidateLineup(
  baseConfig: SimulationConfig,
  side: PositioningOptimizationSide,
  sidePets: (PetConfig | null)[],
  order: number[],
  baselineLineupDeltas: Array<Record<string, number>>,
  projectEndTurnLineup: NonNullable<
    RunPositioningOptimizationParams['projectEndTurnLineup']
  >,
): (PetConfig | null)[] {
  const candidateLineup = applyOrder(sidePets, order);
  const projectedCandidateLineup = normalizeLineupLength(
    projectEndTurnLineup({
      baseConfig,
      side,
      lineup: candidateLineup,
    }),
    candidateLineup.length,
  );
  const candidateLineupDeltas = computeLineupNumericDeltas(
    candidateLineup,
    projectedCandidateLineup,
  );

  return candidateLineup.map((pet, targetIndex) => {
    if (!pet) {
      return null;
    }
    const sourceIndex = order[targetIndex] ?? targetIndex;
    const baselineDelta = baselineLineupDeltas[sourceIndex] ?? {};
    const candidateDelta = candidateLineupDeltas[targetIndex] ?? {};
    const numericKeys = new Set<string>([
      ...Object.keys(candidateDelta),
      ...Object.keys(baselineDelta),
    ]);
    if (numericKeys.size <= 0) {
      return pet;
    }

    const petRecord = pet as unknown as Record<string, unknown>;
    const projectedPet: Record<string, unknown> = {
      ...petRecord,
      equipment:
        petRecord.equipment && typeof petRecord.equipment === 'object'
          ? { ...(petRecord.equipment as Record<string, unknown>) }
          : petRecord.equipment ?? null,
    };

    for (const key of numericKeys) {
      const currentValue = toFiniteNumber(petRecord[key]) ?? 0;
      const projectedValue =
        currentValue + (candidateDelta[key] ?? 0) - (baselineDelta[key] ?? 0);
      projectedPet[key] = projectedValue;
    }

    return projectedPet as unknown as PetConfig;
  });
}

function computeLineupNumericDeltas(
  beforeLineup: (PetConfig | null)[],
  afterLineup: (PetConfig | null)[],
): Array<Record<string, number>> {
  const maxLength = Math.max(beforeLineup.length, afterLineup.length);
  const deltas: Array<Record<string, number>> = [];
  for (let index = 0; index < maxLength; index += 1) {
    deltas.push(
      computePetNumericDelta(
        beforeLineup[index] ?? null,
        afterLineup[index] ?? null,
      ),
    );
  }
  return deltas;
}

function computePetNumericDelta(
  beforePet: PetConfig | null,
  afterPet: PetConfig | null,
): Record<string, number> {
  if (!beforePet || !afterPet) {
    return {};
  }

  const beforeRecord = beforePet as unknown as Record<string, unknown>;
  const afterRecord = afterPet as unknown as Record<string, unknown>;
  const numericKeys = new Set<string>();

  Object.entries(beforeRecord).forEach(([key, value]) => {
    if (toFiniteNumber(value) != null) {
      numericKeys.add(key);
    }
  });
  Object.entries(afterRecord).forEach(([key, value]) => {
    if (toFiniteNumber(value) != null) {
      numericKeys.add(key);
    }
  });

  const delta: Record<string, number> = {};
  for (const key of numericKeys) {
    const beforeValue = toFiniteNumber(beforeRecord[key]) ?? 0;
    const afterValue = toFiniteNumber(afterRecord[key]) ?? 0;
    const difference = afterValue - beforeValue;
    if (difference !== 0) {
      delta[key] = difference;
    }
  }
  return delta;
}

function normalizeLineupLength(
  lineup: (PetConfig | null)[],
  length: number,
): (PetConfig | null)[] {
  const normalized = lineup.slice(0, length);
  while (normalized.length < length) {
    normalized.push(null);
  }
  return normalized;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function generateIndexPermutations<T>(source: T[]): number[][] {
  const size = source.length;
  if (size <= 0) {
    return [[]];
  }

  const groups = groupEquivalentValues(source);
  const remainingCounts = groups.map((group) => group.indices.length);
  const groupOrder = new Array<number>(size);
  const groupPermutations: number[][] = [];

  generateGroupOrderPermutations(
    0,
    groupOrder,
    remainingCounts,
    groupPermutations,
  );

  return groupPermutations.map((permutation) =>
    materializeIndexPermutation(permutation, groups),
  );
}

function groupEquivalentValues<T>(
  source: T[],
): Array<{ representative: T; indices: number[] }> {
  const groups: Array<{ representative: T; indices: number[] }> = [];

  for (let index = 0; index < source.length; index += 1) {
    const value = source[index];
    const existingGroup = groups.find((group) =>
      valuesAreEquivalent(group.representative, value),
    );
    if (existingGroup) {
      existingGroup.indices.push(index);
      continue;
    }
    groups.push({
      representative: value,
      indices: [index],
    });
  }

  return groups;
}

function generateGroupOrderPermutations(
  depth: number,
  groupOrder: number[],
  remainingCounts: number[],
  output: number[][],
): void {
  if (depth >= groupOrder.length) {
    output.push(groupOrder.slice());
    return;
  }

  for (
    let groupIndex = 0;
    groupIndex < remainingCounts.length;
    groupIndex += 1
  ) {
    if (remainingCounts[groupIndex] <= 0) {
      continue;
    }

    groupOrder[depth] = groupIndex;
    remainingCounts[groupIndex] -= 1;
    generateGroupOrderPermutations(
      depth + 1,
      groupOrder,
      remainingCounts,
      output,
    );
    remainingCounts[groupIndex] += 1;
  }
}

function materializeIndexPermutation<T>(
  groupOrder: number[],
  groups: Array<{ representative: T; indices: number[] }>,
): number[] {
  const groupOffsets = groups.map(() => 0);

  return groupOrder.map((groupIndex) => {
    const offset = groupOffsets[groupIndex];
    groupOffsets[groupIndex] += 1;
    const index = groups[groupIndex].indices[offset];
    if (index == null) {
      throw new Error('Failed to map grouped permutation to index permutation.');
    }
    return index;
  });
}

function valuesAreEquivalent(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (left == null || right == null) {
    return left === right;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) {
      return false;
    }
    if (left.length !== right.length) {
      return false;
    }
    for (let index = 0; index < left.length; index += 1) {
      if (!valuesAreEquivalent(left[index], right[index])) {
        return false;
      }
    }
    return true;
  }

  if (typeof left !== 'object' || typeof right !== 'object') {
    return false;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (let index = 0; index < leftKeys.length; index += 1) {
    const leftKey = leftKeys[index];
    const rightKey = rightKeys[index];
    if (leftKey !== rightKey) {
      return false;
    }
    if (!valuesAreEquivalent(leftRecord[leftKey], rightRecord[rightKey])) {
      return false;
    }
  }

  return true;
}
