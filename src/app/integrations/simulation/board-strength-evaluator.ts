import {
  PetConfig,
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';

export type BoardStrengthSide = 'player' | 'opponent';
export type BoardStrengthPrecision = 'quick' | 'standard' | 'high';
export type BoardStrengthPhase = 'scan' | 'refine' | 'complete';

export interface BoardStrengthOptions {
  side: BoardStrengthSide;
  precision?: BoardStrengthPrecision;
  minStat?: number;
  maxStat?: number;
  seed?: number | null;
}

export interface BoardStrengthPoint {
  stat: number;
  wins: number;
  draws: number;
  losses: number;
  battles: number;
  expectedScore: number;
  smoothedScore: number;
}

export interface BoardStrengthProgress {
  phase: BoardStrengthPhase;
  completedStats: number;
  totalStats: number;
  currentStat: number;
  battlesCompleted: number;
  maximumBattles: number;
  refinementRound: number;
}

export interface BoardStrengthResult {
  version: 'BS1';
  side: BoardStrengthSide;
  precision: BoardStrengthPrecision;
  score: number;
  benchmark50: number | null;
  estimatedPrecision95: number;
  totalBattles: number;
  minStat: number;
  maxStat: number;
  points: BoardStrengthPoint[];
  aborted: boolean;
}

export interface BoardStrengthRunContext {
  baseConfig: SimulationConfig;
  options: BoardStrengthOptions;
  simulateBatch: (config: SimulationConfig) => SimulationResult;
  shouldAbort?: () => boolean;
  onProgress?: (progress: BoardStrengthProgress) => void;
}

interface PrecisionProfile {
  initialBattles: number;
  batchSize: number;
  maxBattlesPerStat: number;
  targetStandardError: number;
}

interface MutablePoint {
  stat: number;
  wins: number;
  draws: number;
  losses: number;
  battles: number;
}

const DEFAULT_SEED = 730241;

const PRECISION_PROFILES: Readonly<Record<BoardStrengthPrecision, PrecisionProfile>> = {
  quick: {
    initialBattles: 25,
    batchSize: 25,
    maxBattlesPerStat: 100,
    targetStandardError: 0.055,
  },
  standard: {
    initialBattles: 50,
    batchSize: 50,
    maxBattlesPerStat: 200,
    targetStandardError: 0.04,
  },
  high: {
    initialBattles: 100,
    batchSize: 100,
    maxBattlesPerStat: 400,
    targetStandardError: 0.025,
  },
};

export function getBoardStrengthPrecisionProfile(
  precision: BoardStrengthPrecision,
): Readonly<PrecisionProfile> {
  return PRECISION_PROFILES[precision];
}

export function runBoardStrengthEvaluation(
  context: BoardStrengthRunContext,
): BoardStrengthResult {
  const precision = context.options.precision ?? 'standard';
  const profile = PRECISION_PROFILES[precision];
  const minStat = clampInteger(context.options.minStat ?? 1, 1, 100);
  const maxStat = clampInteger(
    context.options.maxStat ?? 100,
    minStat,
    100,
  );
  const stats = Array.from(
    { length: maxStat - minStat + 1 },
    (_, index) => minStat + index,
  );
  const points = stats.map<MutablePoint>((stat) => ({
    stat,
    wins: 0,
    draws: 0,
    losses: 0,
    battles: 0,
  }));
  const maximumBattles = stats.length * profile.maxBattlesPerStat;
  let battlesCompleted = 0;
  let completedStats = 0;
  let refinementRound = 0;

  const simulatePoint = (point: MutablePoint, count: number) => {
    const config = createBoardStrengthMatchConfig(
      context.baseConfig,
      context.options.side,
      point.stat,
      count,
      (context.options.seed ?? context.baseConfig.seed ?? DEFAULT_SEED) +
        point.stat * 10000 +
        point.battles,
    );
    const result = context.simulateBatch(config);
    const candidateWins =
      context.options.side === 'player'
        ? result.playerWins
        : result.opponentWins;
    const candidateLosses =
      context.options.side === 'player'
        ? result.opponentWins
        : result.playerWins;
    const completed = candidateWins + candidateLosses + result.draws;

    point.wins += candidateWins;
    point.losses += candidateLosses;
    point.draws += result.draws;
    point.battles += completed;
    battlesCompleted += completed;
  };

  for (const point of points) {
    if (context.shouldAbort?.()) {
      return buildResult(points, context.options.side, precision, minStat, maxStat, true);
    }
    simulatePoint(point, profile.initialBattles);
    completedStats += 1;
    context.onProgress?.({
      phase: 'scan',
      completedStats,
      totalStats: stats.length,
      currentStat: point.stat,
      battlesCompleted,
      maximumBattles,
      refinementRound,
    });
  }

  while (true) {
    const candidates = points.filter(
      (point) =>
        point.battles < profile.maxBattlesPerStat &&
        estimateStandardError(point) > profile.targetStandardError,
    );
    if (candidates.length === 0) {
      break;
    }

    refinementRound += 1;
    for (const point of candidates) {
      if (context.shouldAbort?.()) {
        return buildResult(points, context.options.side, precision, minStat, maxStat, true);
      }
      const remaining = profile.maxBattlesPerStat - point.battles;
      simulatePoint(point, Math.min(profile.batchSize, remaining));
      context.onProgress?.({
        phase: 'refine',
        completedStats,
        totalStats: stats.length,
        currentStat: point.stat,
        battlesCompleted,
        maximumBattles,
        refinementRound,
      });
    }
  }

  context.onProgress?.({
    phase: 'complete',
    completedStats: stats.length,
    totalStats: stats.length,
    currentStat: maxStat,
    battlesCompleted,
    maximumBattles,
    refinementRound,
  });

  return buildResult(
    points,
    context.options.side,
    precision,
    minStat,
    maxStat,
    false,
  );
}

export function createBoardStrengthMatchConfig(
  baseConfig: SimulationConfig,
  side: BoardStrengthSide,
  stat: number,
  simulationCount: number,
  seed: number,
): SimulationConfig {
  const config = deepClone(baseConfig);
  const benchmarkPets = createBenchmarkPets(stat);
  const candidatePack =
    side === 'player' ? config.playerPack : config.opponentPack;

  if (side === 'player') {
    config.opponentPets = benchmarkPets;
    config.opponentPack = candidatePack;
    config.opponentToy = null;
    config.opponentHardToy = null;
    config.opponentGoldSpent = 0;
    config.opponentRollAmount = 0;
    config.opponentSummonedAmount = 0;
    config.opponentLevel3Sold = 0;
    config.opponentTransformationAmount = 0;
    config.opponentLostLastBattle = false;
  } else {
    config.playerPets = benchmarkPets;
    config.playerPack = candidatePack;
    config.playerToy = null;
    config.playerHardToy = null;
    config.playerGoldSpent = 0;
    config.playerRollAmount = 0;
    config.playerSummonedAmount = 0;
    config.playerLevel3Sold = 0;
    config.playerTransformationAmount = 0;
    config.playerLostLastBattle = false;
  }

  config.simulationCount = simulationCount;
  config.seed = Math.trunc(seed);
  config.logsEnabled = false;
  config.maxLoggedBattles = 0;
  config.captureRandomDecisions = false;
  config.randomDecisionOverrides = [];
  config.optimizeDeterministicSimulations = false;
  return config;
}

export function createBoardStrengthFingerprint(
  baseConfig: SimulationConfig,
  side: BoardStrengthSide,
): string {
  const normalized = createBoardStrengthMatchConfig(
    baseConfig,
    side,
    1,
    1,
    DEFAULT_SEED,
  );
  normalized.seed = null;
  normalized.simulationCount = 1;
  return JSON.stringify(normalized);
}

function createBenchmarkPets(stat: number): PetConfig[] {
  const normalizedStat = clampInteger(stat, 1, 100);
  return Array.from({ length: 5 }, () => {
    const pet: PetConfig = {
      name: 'Benchmark Pet',
      benchmark: true,
      attack: normalizedStat,
      health: normalizedStat,
      exp: 0,
      equipment: null,
      mana: 0,
    };
    return pet;
  });
}

function buildResult(
  mutablePoints: MutablePoint[],
  side: BoardStrengthSide,
  precision: BoardStrengthPrecision,
  minStat: number,
  maxStat: number,
  aborted: boolean,
): BoardStrengthResult {
  const rawScores = mutablePoints.map((point) => getExpectedScore(point));
  const weights = mutablePoints.map((point) => Math.max(1, point.battles));
  const smoothedScores = decreasingIsotonicRegression(rawScores, weights);
  const points = mutablePoints.map<BoardStrengthPoint>((point, index) => ({
    ...point,
    expectedScore: rawScores[index],
    smoothedScore: smoothedScores[index],
  }));
  const score = rawScores.reduce((sum, value) => sum + value, 0);
  const varianceOfScore = mutablePoints.reduce((sum, point) => {
    const standardError = estimateStandardError(point);
    return sum + standardError * standardError;
  }, 0);

  return {
    version: 'BS1',
    side,
    precision,
    score,
    benchmark50: findBenchmark50(points),
    estimatedPrecision95: 1.96 * Math.sqrt(varianceOfScore),
    totalBattles: mutablePoints.reduce(
      (sum, point) => sum + point.battles,
      0,
    ),
    minStat,
    maxStat,
    points,
    aborted,
  };
}

function getExpectedScore(point: MutablePoint): number {
  if (point.battles === 0) {
    return 0;
  }
  return (point.wins + point.draws * 0.5) / point.battles;
}

function estimateStandardError(point: MutablePoint): number {
  if (point.battles === 0) {
    return Number.POSITIVE_INFINITY;
  }
  const mean = getExpectedScore(point);
  const secondMoment =
    (point.wins + point.draws * 0.25) / point.battles;
  const empiricalVariance = Math.max(0, secondMoment - mean * mean);
  const smoothedMean =
    (point.wins + point.draws * 0.5 + 1) / (point.battles + 2);
  const conservativeVariance = Math.max(
    empiricalVariance,
    smoothedMean * (1 - smoothedMean),
  );
  return Math.sqrt(conservativeVariance / point.battles);
}

function decreasingIsotonicRegression(
  values: number[],
  weights: number[],
): number[] {
  const blocks: Array<{
    start: number;
    end: number;
    weight: number;
    weightedValue: number;
  }> = [];

  values.forEach((value, index) => {
    const weight = weights[index] ?? 1;
    blocks.push({
      start: index,
      end: index,
      weight,
      weightedValue: value * weight,
    });
    while (blocks.length >= 2) {
      const right = blocks[blocks.length - 1];
      const left = blocks[blocks.length - 2];
      const leftMean = left.weightedValue / left.weight;
      const rightMean = right.weightedValue / right.weight;
      if (leftMean >= rightMean) {
        break;
      }
      blocks.splice(blocks.length - 2, 2, {
        start: left.start,
        end: right.end,
        weight: left.weight + right.weight,
        weightedValue: left.weightedValue + right.weightedValue,
      });
    }
  });

  const fitted = Array.from({ length: values.length }, () => 0);
  for (const block of blocks) {
    const mean = block.weightedValue / block.weight;
    for (let index = block.start; index <= block.end; index += 1) {
      fitted[index] = mean;
    }
  }
  return fitted;
}

function findBenchmark50(points: BoardStrengthPoint[]): number | null {
  let highestPassingStat: number | null = null;
  for (const point of points) {
    if (point.smoothedScore < 0.5) {
      break;
    }
    highestPassingStat = point.stat;
  }
  return highestPassingStat;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function clampInteger(value: number, minimum: number, maximum: number): number {
  const normalized = Number.isFinite(value) ? Math.trunc(value) : minimum;
  return Math.min(maximum, Math.max(minimum, normalized));
}
