import { CalculatorBattleEngine } from '../src/app/integrations/simulation/battle-engine';
import { runHeadlessSimulation as engineHeadlessSimulation } from 'sap-battle-engine';
import {
  SimulationConfig,
  SimulationResult,
} from '../src/app/domain/interfaces/simulation-config.interface';
import {
  parseTeamwoodReplayForCalculator,
  ReplayActionsContainerJson,
  ReplayBotTurnsContainerJson,
  ReplayCalculatorState,
  ReplayMetaBoards,
  ReplayParseOptions,
  ReplayCalcParser,
} from '../src/app/integrations/replay/replay-calc-parser';
import {
  PositioningOptimizationResult,
  PositioningOptimizationSide,
  runPositioningOptimization,
} from '../src/app/integrations/simulation/positioning-optimizer';
import {
  BoardStrengthPrecision,
  BoardStrengthResult,
  runBoardStrengthEvaluation,
} from '../src/app/integrations/simulation/board-strength-evaluator';

export function runSimulation(config: SimulationConfig): SimulationResult {
  return new CalculatorBattleEngine().run(config);
}
export { engineHeadlessSimulation as runHeadlessSimulation };
export type { HeadlessSimulationOptions } from 'sap-battle-engine';

export type ReplayPayloadJson =
  | ReplayActionsContainerJson
  | ReplayBotTurnsContainerJson;

function toNumberOrFallback(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function normalizeCalculatorBaseUrl(baseUrl?: string): URL {
  const fallbackUrl = 'https://sap-calculator.com/';
  const candidate = typeof baseUrl === 'string' && baseUrl.trim().length > 0
    ? baseUrl.trim()
    : fallbackUrl;
  try {
    return new URL(candidate);
  } catch {
    return new URL(fallbackUrl);
  }
}

export function parseReplayCalculatorState(
  replay: ReplayPayloadJson,
  turnNumber: number,
  metaBoards?: ReplayMetaBoards,
  options?: ReplayParseOptions,
): ReplayCalculatorState | null {
  return parseTeamwoodReplayForCalculator(
    replay,
    turnNumber,
    metaBoards,
    options,
  );
}

export function createSimulationConfigFromCalculatorState(
  calculatorState: ReplayCalculatorState,
  simulationCount: number,
): SimulationConfig {
  return {
    playerPack: calculatorState.playerPack,
    opponentPack: calculatorState.opponentPack,
    playerToy: calculatorState.playerToy,
    playerToyLevel: toNumberOrFallback(calculatorState.playerToyLevel, 1),
    playerHardToy: calculatorState.playerHardToy,
    playerHardToyLevel: calculatorState.playerHardToyLevel,
    opponentToy: calculatorState.opponentToy,
    opponentToyLevel: toNumberOrFallback(calculatorState.opponentToyLevel, 1),
    opponentHardToy: calculatorState.opponentHardToy,
    opponentHardToyLevel: calculatorState.opponentHardToyLevel,
    turn: calculatorState.turn,
    playerGoldSpent: calculatorState.playerGoldSpent,
    opponentGoldSpent: calculatorState.opponentGoldSpent,
    playerRollAmount: calculatorState.playerRollAmount,
    opponentRollAmount: calculatorState.opponentRollAmount,
    playerSummonedAmount: calculatorState.playerSummonedAmount,
    opponentSummonedAmount: calculatorState.opponentSummonedAmount,
    playerLevel3Sold: calculatorState.playerLevel3Sold,
    opponentLevel3Sold: calculatorState.opponentLevel3Sold,
    playerTransformationAmount: calculatorState.playerTransformationAmount,
    opponentTransformationAmount: calculatorState.opponentTransformationAmount,
    playerPets: calculatorState.playerPets,
    opponentPets: calculatorState.opponentPets,
    customPacks: calculatorState.customPacks,
    allPets: calculatorState.allPets,
    oldStork: calculatorState.oldStork,
    tokenPets: calculatorState.tokenPets,
    komodoShuffle: calculatorState.komodoShuffle,
    mana: calculatorState.mana,
    seed: calculatorState.seed,
    simulationCount,
    logsEnabled: false,
    maxLoggedBattles: 0,
  };
}

export function runReplayOddsFromCalculatorState(
  calculatorState: ReplayCalculatorState,
  simulationCount: number,
): SimulationResult {
  const config = createSimulationConfigFromCalculatorState(
    calculatorState,
    simulationCount,
  );
  return runSimulation(config);
}

export type ReplayAnalysisPrecision = 'quick' | 'standard' | 'high';

export interface ReplayPositioningOptions {
  side: PositioningOptimizationSide;
  precision?: ReplayAnalysisPrecision;
  simulationCount?: number;
  projectEndTurnEffects?: boolean;
  recomputeParrotCopies?: boolean;
}

export interface ReplayPositioningResult {
  precision: ReplayAnalysisPrecision;
  simulationCount: number;
  baseline: SimulationResult;
  optimized: SimulationResult;
  optimization: PositioningOptimizationResult;
  optimizedCalculatorState: ReplayCalculatorState;
}

export interface ReplayStrengthResult {
  precision: BoardStrengthPrecision;
  player: BoardStrengthResult;
  opponent: BoardStrengthResult;
}

export interface ReplayStrengthRange {
  minStat?: number;
  maxStat?: number;
}

const POSITIONING_SIMULATIONS: Readonly<Record<ReplayAnalysisPrecision, number>> = {
  quick: 100,
  standard: 250,
  high: 500,
};

function normalizeSimulationCount(value: number | undefined, fallback: number): number {
  if (value == null || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.trunc(value));
}

function clonePetLineup(
  lineup: ReplayCalculatorState['playerPets'],
): ReplayCalculatorState['playerPets'] {
  return (lineup ?? []).map((pet) =>
    pet
      ? {
          ...pet,
          equipment: pet.equipment ? { ...pet.equipment } : null,
        }
      : null,
  );
}

export function runReplayPositioningFromCalculatorState(
  calculatorState: ReplayCalculatorState,
  options: ReplayPositioningOptions,
): ReplayPositioningResult {
  const precision = options.precision ?? 'quick';
  const simulationCount = normalizeSimulationCount(
    options.simulationCount,
    POSITIONING_SIMULATIONS[precision],
  );
  const baseConfig = createSimulationConfigFromCalculatorState(
    calculatorState,
    simulationCount,
  );
  const runner = new CalculatorBattleEngine();
  const projectionRunner = new CalculatorBattleEngine();
  const baseline = runner.run(baseConfig);
  const projectEndTurnEffects = options.projectEndTurnEffects !== false;
  const recomputeParrotCopies = options.recomputeParrotCopies !== false;
  const optimization = runPositioningOptimization({
    baseConfig,
    options: {
      side: options.side,
      maxSimulationsPerPermutation: simulationCount,
      batchSize: Math.min(25, simulationCount),
      minSamplesBeforeElimination: Math.min(50, simulationCount),
      confidenceZ: 1.96,
      keepSameBuffTargets: !projectEndTurnEffects,
      recomputeParrotCopies,
    },
    simulateBatch: (config) => runner.run(config),
    projectEndTurnLineup: projectEndTurnEffects
      ? ({ baseConfig: projectionConfig, side, lineup }) =>
          projectionRunner.projectLineupAfterEndTurn(
            projectionConfig,
            side,
            lineup,
          )
      : undefined,
  });
  const optimizedLineup =
    optimization.bestPermutation.simulationLineup.length > 0
      ? optimization.bestPermutation.simulationLineup
      : optimization.bestPermutation.lineup;
  const optimizedCalculatorState: ReplayCalculatorState = {
    ...calculatorState,
    playerPets: clonePetLineup(
      optimization.side === 'player'
        ? optimizedLineup
        : calculatorState.playerPets,
    ),
    opponentPets: clonePetLineup(
      optimization.side === 'opponent'
        ? optimizedLineup
        : calculatorState.opponentPets,
    ),
  };
  const optimized = runner.run(
    createSimulationConfigFromCalculatorState(
      optimizedCalculatorState,
      simulationCount,
    ),
  );

  return {
    precision,
    simulationCount,
    baseline,
    optimized,
    optimization,
    optimizedCalculatorState,
  };
}

export function runReplayStrengthFromCalculatorState(
  calculatorState: ReplayCalculatorState,
  precision: BoardStrengthPrecision = 'quick',
  range: ReplayStrengthRange = {},
): ReplayStrengthResult {
  const baseConfig = createSimulationConfigFromCalculatorState(calculatorState, 1);
  const runner = new CalculatorBattleEngine();
  const evaluate = (side: 'player' | 'opponent'): BoardStrengthResult =>
    runBoardStrengthEvaluation({
      baseConfig,
      options: {
        side,
        precision,
        minStat: range.minStat,
        maxStat: range.maxStat,
      },
      simulateBatch: (config) => runner.run(config),
    });

  return {
    precision,
    player: evaluate('player'),
    opponent: evaluate('opponent'),
  };
}

export function generateReplayCalculatorLink(
  calculatorState: ReplayCalculatorState,
  baseUrl?: string,
): string {
  const parser = new ReplayCalcParser();
  const normalizedBaseUrl = normalizeCalculatorBaseUrl(baseUrl);

  const globalWithWindow = globalThis as typeof globalThis & {
    window?: Window & typeof globalThis;
  };

  const previousWindow = globalWithWindow.window;
  const hadWindow = Object.prototype.hasOwnProperty.call(globalWithWindow, 'window');

  globalWithWindow.window = {
    location: {
      origin: normalizedBaseUrl.origin,
      pathname: normalizedBaseUrl.pathname,
    },
  } as Window & typeof globalThis;

  try {
    const hashLink = parser.generateCalculatorLink(calculatorState);
    return hashLink.replace('#c=', '?c=');
  } finally {
    if (hadWindow) {
      globalWithWindow.window = previousWindow;
    } else {
      delete globalWithWindow.window;
    }
  }
}

export * from '../src/app/domain/interfaces/simulation-config.interface';
export * from '../src/app/integrations/replay/replay-calc-parser';
export * from '../src/app/integrations/simulation/positioning-optimizer';
export * from '../src/app/integrations/simulation/board-strength-evaluator';




export { createBattleEngine, catalogs, optimizeFight } from 'sap-battle-engine';
