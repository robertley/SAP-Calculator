import {
  SimulationConfig,
  SimulationResult,
  PetConfig,
} from '../src/app/domain/interfaces/simulation-config.interface';
import { runHeadlessSimulation } from './simulate';
import { getDefaultTeams } from '../src/app/integrations/team-presets.defaults';

export interface TeamSideConfig {
  pack?: string;
  toy?: string | null;
  toyLevel?: number;
  hardToy?: string | null;
  hardToyLevel?: number;
  turn?: number;
  goldSpent?: number;
  rollAmount?: number;
  summonedAmount?: number;
  level3Sold?: number;
  transformationAmount?: number;
  pets: (PetConfig | null)[];
}

export interface EvaluateRequest {
  candidate: TeamSideConfig;
  opponents: TeamSideConfig[];
  simulationsPerMatchup?: number;
  baseConfig?: Partial<SimulationConfig>;
  seed?: number | null;
  variancePenalty?: number;
  matchupWeights?: number[];
  includeMatchups?: boolean;
}

export interface EvaluateBatchRequest {
  candidates: TeamSideConfig[];
  opponents: TeamSideConfig[];
  simulationsPerMatchup?: number;
  baseConfig?: Partial<SimulationConfig>;
  seed?: number | null;
  variancePenalty?: number;
  matchupWeights?: number[];
  includeMatchups?: boolean;
}

export interface EvaluatedMatchup {
  index: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  weightedWinRate: number;
  weight: number;
}

export interface EvaluateResponse {
  fitness: number;
  meanWinRate: number;
  weightedWinRate: number;
  stdDev: number;
  variancePenalty: number;
  confidence95: number;
  simulationsPerMatchup: number;
  opponentCount: number;
  totalBattles: number;
  matchups?: EvaluatedMatchup[];
}

export interface PresetPoolEntry {
  id: string;
  name: string;
  team: TeamSideConfig;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function normalizePet(pet: unknown): PetConfig | null {
  if (!isRecord(pet)) {
    return null;
  }
  const name = typeof pet.name === 'string' ? pet.name : '';
  if (!name.trim()) {
    return null;
  }
  const normalized: Record<string, unknown> = { ...pet, name };
  if ('equipment' in normalized) {
    const rawEquipment = normalized.equipment;
    if (typeof rawEquipment === 'string') {
      normalized.equipment = rawEquipment.trim()
        ? { name: rawEquipment.trim() }
        : null;
    } else if (isRecord(rawEquipment)) {
      const equipmentName =
        typeof rawEquipment.name === 'string' ? rawEquipment.name.trim() : '';
      normalized.equipment = equipmentName ? { name: equipmentName } : null;
    } else {
      normalized.equipment = null;
    }
  }
  return normalized as PetConfig;
}

function normalizePetList(
  pets: unknown,
  targetLength: number = 5,
): (PetConfig | null)[] {
  const list = Array.isArray(pets) ? pets : [];
  const normalized = list.slice(0, targetLength).map((pet) => normalizePet(pet));
  while (normalized.length < targetLength) {
    normalized.push(null);
  }
  return normalized;
}

function normalizeTeamSide(input: unknown): TeamSideConfig {
  const side = isRecord(input) ? input : {};
  return {
    pack: typeof side.pack === 'string' && side.pack.trim()
      ? side.pack.trim()
      : undefined,
    toy: typeof side.toy === 'string' ? side.toy : side.toy === null ? null : undefined,
    toyLevel:
      side.toyLevel == null ? undefined : Math.max(1, Math.trunc(parseNumber(side.toyLevel, 1))),
    hardToy:
      typeof side.hardToy === 'string'
        ? side.hardToy
        : side.hardToy === null
          ? null
          : undefined,
    hardToyLevel:
      side.hardToyLevel == null
        ? undefined
        : Math.max(1, Math.trunc(parseNumber(side.hardToyLevel, 1))),
    turn:
      side.turn == null
        ? undefined
        : Math.max(1, Math.trunc(parseNumber(side.turn, 11))),
    goldSpent:
      side.goldSpent == null
        ? undefined
        : Math.max(0, Math.trunc(parseNumber(side.goldSpent, 10))),
    rollAmount:
      side.rollAmount == null
        ? undefined
        : Math.max(0, Math.trunc(parseNumber(side.rollAmount, 4))),
    summonedAmount:
      side.summonedAmount == null
        ? undefined
        : Math.max(0, Math.trunc(parseNumber(side.summonedAmount, 0))),
    level3Sold:
      side.level3Sold == null
        ? undefined
        : Math.max(0, Math.trunc(parseNumber(side.level3Sold, 0))),
    transformationAmount:
      side.transformationAmount == null
        ? undefined
        : Math.max(0, Math.trunc(parseNumber(side.transformationAmount, 0))),
    pets: normalizePetList(side.pets),
  };
}

function defaultSimulationConfig(): SimulationConfig {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    playerToy: null,
    playerToyLevel: 1,
    playerHardToy: null,
    playerHardToyLevel: 1,
    opponentToy: null,
    opponentToyLevel: 1,
    opponentHardToy: null,
    opponentHardToyLevel: 1,
    turn: 11,
    playerGoldSpent: 10,
    opponentGoldSpent: 10,
    playerRollAmount: 4,
    opponentRollAmount: 4,
    playerSummonedAmount: 0,
    opponentSummonedAmount: 0,
    playerLevel3Sold: 0,
    opponentLevel3Sold: 0,
    playerTransformationAmount: 0,
    opponentTransformationAmount: 0,
    playerPets: [null, null, null, null, null],
    opponentPets: [null, null, null, null, null],
    customPacks: [],
    allPets: false,
    oldStork: false,
    tokenPets: true,
    komodoShuffle: false,
    mana: false,
    seed: null,
    simulationCount: 100,
    logsEnabled: false,
    maxLoggedBattles: 0,
  };
}

function mergeBaseConfig(baseConfig?: Partial<SimulationConfig>): SimulationConfig {
  const defaults = defaultSimulationConfig();
  if (!baseConfig) {
    return defaults;
  }
  return {
    ...defaults,
    ...deepClone(baseConfig),
    playerPets: normalizePetList(baseConfig.playerPets ?? defaults.playerPets),
    opponentPets: normalizePetList(baseConfig.opponentPets ?? defaults.opponentPets),
  };
}

function applySideToConfig(
  config: SimulationConfig,
  side: TeamSideConfig,
  perspective: 'player' | 'opponent',
): void {
  if (perspective === 'player') {
    config.playerPack = side.pack ?? config.playerPack;
    config.playerToy = side.toy === undefined ? config.playerToy : side.toy;
    config.playerToyLevel = side.toyLevel ?? config.playerToyLevel;
    config.playerHardToy =
      side.hardToy === undefined ? config.playerHardToy : side.hardToy;
    config.playerHardToyLevel = side.hardToyLevel ?? config.playerHardToyLevel;
    config.playerGoldSpent = side.goldSpent ?? config.playerGoldSpent;
    config.playerRollAmount = side.rollAmount ?? config.playerRollAmount;
    config.playerSummonedAmount =
      side.summonedAmount ?? config.playerSummonedAmount;
    config.playerLevel3Sold = side.level3Sold ?? config.playerLevel3Sold;
    config.playerTransformationAmount =
      side.transformationAmount ?? config.playerTransformationAmount;
    config.playerPets = normalizePetList(side.pets);
  } else {
    config.opponentPack = side.pack ?? config.opponentPack;
    config.opponentToy = side.toy === undefined ? config.opponentToy : side.toy;
    config.opponentToyLevel = side.toyLevel ?? config.opponentToyLevel;
    config.opponentHardToy =
      side.hardToy === undefined ? config.opponentHardToy : side.hardToy;
    config.opponentHardToyLevel =
      side.hardToyLevel ?? config.opponentHardToyLevel;
    config.opponentGoldSpent = side.goldSpent ?? config.opponentGoldSpent;
    config.opponentRollAmount = side.rollAmount ?? config.opponentRollAmount;
    config.opponentSummonedAmount =
      side.summonedAmount ?? config.opponentSummonedAmount;
    config.opponentLevel3Sold = side.level3Sold ?? config.opponentLevel3Sold;
    config.opponentTransformationAmount =
      side.transformationAmount ?? config.opponentTransformationAmount;
    config.opponentPets = normalizePetList(side.pets);
  }

  if (side.turn != null) {
    config.turn = side.turn;
  }
}

function buildMatchConfig(
  baseConfig: SimulationConfig,
  candidate: TeamSideConfig,
  opponent: TeamSideConfig,
  simulationsPerMatchup: number,
  seed: number | null,
): SimulationConfig {
  const config = deepClone(baseConfig);
  applySideToConfig(config, candidate, 'player');
  applySideToConfig(config, opponent, 'opponent');
  config.simulationCount = simulationsPerMatchup;
  config.seed = seed;
  config.logsEnabled = false;
  config.maxLoggedBattles = 0;
  config.captureRandomDecisions = false;
  return config;
}

function runMatch(config: SimulationConfig): SimulationResult {
  return runHeadlessSimulation(config, {
    includeBattles: false,
    enableLogs: false,
  });
}

function computeStdDev(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(Math.max(0, variance));
}

function normalizeWeights(count: number, weights?: number[]): number[] {
  if (!weights || weights.length === 0) {
    return Array.from({ length: count }, () => 1 / Math.max(1, count));
  }
  const normalized = Array.from({ length: count }, (_, index) => {
    const value = Number(weights[index]);
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
  const sum = normalized.reduce((acc, value) => acc + value, 0);
  if (sum <= 0) {
    return Array.from({ length: count }, () => 1 / Math.max(1, count));
  }
  return normalized.map((value) => value / sum);
}

export function evaluateCandidateVsPool(input: EvaluateRequest): EvaluateResponse {
  const candidate = normalizeTeamSide(input.candidate);
  const opponents = Array.isArray(input.opponents)
    ? input.opponents.map((opponent) => normalizeTeamSide(opponent))
    : [];

  if (opponents.length === 0) {
    throw new Error('Evaluation requires at least one opponent team.');
  }

  const simulationsPerMatchup = Math.max(
    1,
    Math.trunc(parseNumber(input.simulationsPerMatchup, 100)),
  );
  const variancePenalty = Math.max(0, parseNumber(input.variancePenalty, 0.1));
  const baseConfig = mergeBaseConfig(input.baseConfig);
  const weights = normalizeWeights(opponents.length, input.matchupWeights);
  const matchups: EvaluatedMatchup[] = [];
  const winRates: number[] = [];

  for (let index = 0; index < opponents.length; index += 1) {
    const opponent = opponents[index];
    const matchupSeed =
      input.seed == null ? null : Math.trunc(parseNumber(input.seed, 0)) + index;
    const config = buildMatchConfig(
      baseConfig,
      candidate,
      opponent,
      simulationsPerMatchup,
      matchupSeed,
    );
    const result = runMatch(config);
    const total = Math.max(
      1,
      result.playerWins + result.opponentWins + result.draws,
    );
    const winRate = result.playerWins / total;
    winRates.push(winRate);
    matchups.push({
      index,
      wins: result.playerWins,
      losses: result.opponentWins,
      draws: result.draws,
      winRate,
      weightedWinRate: winRate * weights[index],
      weight: weights[index],
    });
  }

  const meanWinRate =
    winRates.reduce((sum, value) => sum + value, 0) / Math.max(1, winRates.length);
  const weightedWinRate = matchups.reduce(
    (sum, matchup) => sum + matchup.weightedWinRate,
    0,
  );
  const stdDev = computeStdDev(winRates);
  const fitness = weightedWinRate - variancePenalty * stdDev;
  const totalBattles = simulationsPerMatchup * opponents.length;
  const confidence95 =
    1.96 * Math.sqrt((meanWinRate * (1 - meanWinRate)) / Math.max(1, totalBattles));

  return {
    fitness,
    meanWinRate,
    weightedWinRate,
    stdDev,
    variancePenalty,
    confidence95,
    simulationsPerMatchup,
    opponentCount: opponents.length,
    totalBattles,
    ...(input.includeMatchups ? { matchups } : {}),
  };
}

export function evaluateCandidateBatch(input: EvaluateBatchRequest): EvaluateResponse[] {
  if (!Array.isArray(input.candidates) || input.candidates.length === 0) {
    return [];
  }
  return input.candidates.map((candidate, index) => {
    const seed =
      input.seed == null
        ? null
        : Math.trunc(parseNumber(input.seed, 0)) + index * 100000;
    return evaluateCandidateVsPool({
      candidate,
      opponents: input.opponents,
      simulationsPerMatchup: input.simulationsPerMatchup,
      baseConfig: input.baseConfig,
      seed,
      variancePenalty: input.variancePenalty,
      matchupWeights: input.matchupWeights,
      includeMatchups: input.includeMatchups,
    });
  });
}

export function getDefaultPresetPool(): PresetPoolEntry[] {
  const teams = getDefaultTeams();
  return teams.map((team) => {
    const side: TeamSideConfig = {
      pack: 'Turtle',
      toy:
        team.playerToyName ?? team.toyName ?? team.opponentToyName ?? null,
      toyLevel:
        team.playerToyLevel ?? team.toyLevel ?? team.opponentToyLevel ?? 1,
      hardToy: team.playerHardToy ?? team.opponentHardToy ?? null,
      hardToyLevel:
        team.playerHardToyLevel ?? team.opponentHardToyLevel ?? 1,
      turn: team.turn ?? 11,
      goldSpent: team.playerGoldSpent ?? team.opponentGoldSpent ?? 10,
      rollAmount: team.playerRollAmount ?? team.opponentRollAmount ?? 4,
      summonedAmount:
        team.playerSummonedAmount ?? team.opponentSummonedAmount ?? 0,
      level3Sold: team.playerLevel3Sold ?? team.opponentLevel3Sold ?? 0,
      transformationAmount:
        team.playerTransformationAmount ?? team.opponentTransformationAmount ?? 0,
      pets: normalizePetList(team.pets),
    };

    return {
      id: team.id,
      name: team.name,
      team: side,
    };
  });
}