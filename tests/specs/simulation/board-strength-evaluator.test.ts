import {
  createBoardStrengthFingerprint,
  createBoardStrengthMatchConfig,
  runBoardStrengthEvaluation,
} from '../../../src/app/integrations/simulation/board-strength-evaluator';
import {
  SimulationConfig,
  SimulationResult,
} from '../../../src/app/domain/interfaces/simulation-config.interface';
import { runSimulation } from '../../../simulation/simulate';

function baseConfig(): SimulationConfig {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Puppy',
    playerToy: null,
    opponentToy: 'Balloon',
    turn: 11,
    playerPets: [{ name: 'Ant', attack: 2, health: 1 }],
    opponentPets: [{ name: 'Dog', attack: 3, health: 3 }],
    simulationCount: 1,
    logsEnabled: false,
  };
}

function result(
  playerWins: number,
  opponentWins: number,
  draws: number,
): SimulationResult {
  return { playerWins, opponentWins, draws, battles: [] };
}

describe('board strength evaluator', () => {
  it('sums expected points across the benchmark ladder', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: {
        side: 'player',
        precision: 'quick',
        minStat: 1,
        maxStat: 5,
      },
      simulateBatch: (config) => {
        const stat = config.opponentPets[0]?.attack ?? 0;
        const count = config.simulationCount ?? 0;
        return stat <= 3 ? result(count, 0, 0) : result(0, count, 0);
      },
    });

    expect(evaluation.score).toBe(3);
    expect(evaluation.benchmark50).toBe(3);
    expect(evaluation.totalBattles).toBe(125);
    expect(evaluation.points).toHaveLength(5);
  });

  it('counts draws as half a win', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: {
        side: 'player',
        precision: 'quick',
        minStat: 1,
        maxStat: 5,
      },
      simulateBatch: (config) => {
        const stat = config.opponentPets[0]?.attack ?? 0;
        const count = config.simulationCount ?? 0;
        if (stat <= 2) return result(count, 0, 0);
        if (stat === 3) return result(0, 0, count);
        return result(0, count, 0);
      },
    });

    expect(evaluation.score).toBe(2.5);
    expect(evaluation.benchmark50).toBe(3);
  });

  it('adaptively refines uncertain points', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: {
        side: 'player',
        precision: 'quick',
        minStat: 1,
        maxStat: 2,
      },
      simulateBatch: (config) => {
        const stat = config.opponentPets[0]?.attack ?? 0;
        const count = config.simulationCount ?? 0;
        return stat === 1
          ? result(Math.floor(count / 2), Math.ceil(count / 2), 0)
          : result(0, count, 0);
      },
    });

    expect(evaluation.points[0].battles).toBe(100);
    expect(evaluation.points[1].battles).toBe(25);
    expect(evaluation.totalBattles).toBe(125);
  });

  it('preserves non-monotonic rebounds and uses the highest passing benchmark', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: { side: 'player', precision: 'quick', minStat: 1, maxStat: 5 },
      simulateBatch: (config) => {
        const stat = config.opponentPets[0]?.attack ?? 0;
        const count = config.simulationCount ?? 0;
        return stat === 2 || stat === 5
          ? result(count, 0, 0)
          : result(0, count, 0);
      },
    });

    expect(evaluation.points.map((point) => point.smoothedScore)).toEqual([0, 1, 0, 0, 1]);
    expect(evaluation.benchmark50).toBe(5);
  });

  it('automatically expands beyond 500 for strong boards', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: { side: 'player', precision: 'quick' },
      simulateBatch: (config) => {
        const stat = config.opponentPets[0]?.attack ?? 0;
        const count = config.simulationCount ?? 0;
        return stat <= 550 ? result(count, 0, 0) : result(0, count, 0);
      },
    });

    expect(evaluation.maxStat).toBe(600);
    expect(evaluation.score).toBe(550);
    expect(evaluation.benchmark50).toBe(550);
    expect(evaluation.rangeTruncated).toBe(false);
  });

  it('discovers a high-stat rebound after lower-stat failures', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: { side: 'player', precision: 'quick' },
      simulateBatch: (config) => {
        const stat = config.opponentPets[0]?.attack ?? 0;
        const count = config.simulationCount ?? 0;
        return stat >= 450 && stat <= 550
          ? result(count, 0, 0)
          : result(0, count, 0);
      },
    });

    expect(evaluation.maxStat).toBe(600);
    expect(evaluation.score).toBe(101);
    expect(evaluation.benchmark50).toBe(550);
  });

  it('reports a lower bound when still winning at the evaluation horizon', () => {
    const evaluation = runBoardStrengthEvaluation({
      baseConfig: baseConfig(),
      options: { side: 'player', precision: 'quick' },
      simulateBatch: (config) => result(config.simulationCount ?? 0, 0, 0),
    });

    expect(evaluation.maxStat).toBe(5000);
    expect(evaluation.score).toBe(5000);
    expect(evaluation.rangeTruncated).toBe(true);
  });

  it('places an internal five-pet benchmark on the other side', () => {
    const config = createBoardStrengthMatchConfig(
      baseConfig(),
      'opponent',
      42,
      10,
      123,
    );

    expect(config.playerPets).toHaveLength(5);
    expect(config.playerPets.every((pet) => pet?.benchmark)).toBe(true);
    expect(config.playerPets.every((pet) => pet?.attack === 42)).toBe(true);
    expect(config.playerPets.every((pet) => pet?.health === 42)).toBe(true);
    expect(config.playerToy).toBeNull();
    expect(config.opponentPets[0]?.name).toBe('Dog');
  });

  it('does not invalidate a player score for changes to the replaced opponent', () => {
    const first = baseConfig();
    const second = baseConfig();
    second.opponentPets = [{ name: 'Fish', attack: 50, health: 50 }];
    second.opponentToy = null;

    expect(createBoardStrengthFingerprint(first, 'player')).toBe(
      createBoardStrengthFingerprint(second, 'player'),
    );
  });

  it('runs featureless benchmark pets through the real battle engine', () => {
    const benchmarkTeam = Array.from({ length: 5 }, () => ({
      name: 'Benchmark Pet',
      benchmark: true,
      attack: 10,
      health: 10,
    }));
    const simulation = runSimulation({
      ...baseConfig(),
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      playerPets: benchmarkTeam,
      opponentPets: benchmarkTeam,
      simulationCount: 1,
      logsEnabled: false,
      maxLoggedBattles: 0,
      seed: 42,
    });

    expect(simulation.playerWins).toBe(0);
    expect(simulation.opponentWins).toBe(0);
    expect(simulation.draws).toBe(1);
  });
});
