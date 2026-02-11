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
}

interface RunPositioningOptimizationParams {
  baseConfig: SimulationConfig;
  options: Partial<PositioningOptimizerOptions> & {
    side: PositioningOptimizationSide;
  };
  shouldAbort?: () => boolean;
  onProgress?: (progress: PositioningOptimizerProgress) => void;
  simulateBatch: (config: SimulationConfig) => SimulationResult;
}

const DEFAULT_MAX_SIMULATIONS_PER_PERMUTATION = 400;
const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_CONFIDENCE_Z = 1.96;
const DEFAULT_MIN_SAMPLES_BEFORE_ELIMINATION = 50;
const DEFAULT_BASE_SEED = 123456789;

export function runPositioningOptimization(
  params: RunPositioningOptimizationParams,
): PositioningOptimizationResult {
  const { baseConfig, simulateBatch, shouldAbort, onProgress } = params;
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
  const permutations = generateIndexPermutations(sidePets.length);
  const candidates: CandidateState[] = permutations.map((order) => ({
    order,
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
        [petsKey]: candidate.lineup,
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

function generateIndexPermutations(size: number): number[][] {
  if (size <= 0) {
    return [[]];
  }
  const working = Array.from({ length: size }, (_, index) => index);
  const counters = new Array(size).fill(0);
  const permutations: number[][] = [working.slice()];
  let index = 0;

  while (index < size) {
    if (counters[index] < index) {
      const swapLeft = index % 2 === 0 ? 0 : counters[index];
      const swapRight = index;
      const temp = working[swapLeft];
      working[swapLeft] = working[swapRight];
      working[swapRight] = temp;
      permutations.push(working.slice());
      counters[index] += 1;
      index = 0;
      continue;
    }
    counters[index] = 0;
    index += 1;
  }

  return permutations;
}
