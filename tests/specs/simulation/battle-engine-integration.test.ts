import { describe, expect, it } from 'vitest';
import { createBattleEngine, SimulationConfig } from 'sap-battle-engine';
import {
  CalculatorBattleEngine,
  sampleBattlesByOutcome,
} from 'app/integrations/simulation/battle-engine';
import { LogService } from 'app/integrations/log.service';
import { buildFightAnimationFrames } from 'app/ui/shell/simulation/fight-animation';
import { runHeadlessSimulation } from '../../../simulation/simulate';

const config = (): SimulationConfig => ({
  playerPack: 'Turtle', opponentPack: 'Turtle', turn: 3,
  playerPets: [{ name: 'Ant', attack: 2, health: 1 }, { name: 'Fish', attack: 5, health: 6 }],
  opponentPets: [{ name: 'Pig', attack: 3, health: 4 }],
  seed: 42, simulationCount: 3, logsEnabled: true,
  captureRandomDecisions: true, captureRandomDraws: true,
});

describe('calculator battle-engine integration', () => {
  it('samples each outcome independently while preserving battle order', () => {
    const battles = [
      ...Array.from({ length: 101 }, () => ({ winner: 'player', logs: [] }) as const),
      ...Array.from({ length: 102 }, () => ({ winner: 'opponent', logs: [] }) as const),
      ...Array.from({ length: 103 }, () => ({ winner: 'draw', logs: [] }) as const),
    ];

    const sampled = sampleBattlesByOutcome(battles, 100);

    expect(sampled).toHaveLength(300);
    expect(sampled.filter((battle) => battle.winner === 'player')).toHaveLength(100);
    expect(sampled.filter((battle) => battle.winner === 'opponent')).toHaveLength(100);
    expect(sampled.filter((battle) => battle.winner === 'draw')).toHaveLength(100);
    expect(sampled[100]).toBe(battles[101]);
    expect(sampled[200]).toBe(battles[203]);
  });

  it('preserves engine outcomes, random tapes, final boards and event snapshots', () => {
    const input = config();
    const before = structuredClone(input);
    const expected = createBattleEngine().runSimulation(input);
    const result = new CalculatorBattleEngine().run(input);
    expect(input).toEqual(before);
    expect([result.playerWins, result.opponentWins, result.draws]).toEqual([expected.playerWins, expected.opponentWins, expected.draws]);
    expect(result.randomDecisions).toEqual(expected.randomDecisions);
    expect(result.randomDraws).toEqual(expected.randomDraws);
    expect(result.battles?.[0].finalBoard).toEqual(expected.battles?.[0].finalBoard);
    expect(result.battles?.[0].logs.map((log) => log.board)).toEqual(expected.battles?.[0].logs.map((log) => log.board));
    expect(structuredClone(result)).toEqual(result);
  });

  it('formats board snapshots for the results UI and animation parser', () => {
    const result = new CalculatorBattleEngine().run(config());
    const logs = result.battles?.[0].logs ?? [];
    const board = logs.find((log) => log.message.includes('|'));
    expect(board?.message).toContain('P1');
    expect(board?.message).toContain('O1');
    expect(board?.message).toContain('(5/6/0xp)');
    const frames = buildFightAnimationFrames(logs);
    expect(frames.length).toBeGreaterThan(0);
    expect(frames.some((frame) => frame.playerSlots.some((slot) => slot.petName === 'Fish'))).toBe(true);
  });

  it('keeps results detached across runs and leaves the UI logger alone', () => {
    const logger = new LogService();
    logger.setEnabled(false);
    const engine = new CalculatorBattleEngine(logger);
    const result = engine.run(config());
    const before = structuredClone(result);
    engine.run({ ...config(), playerPets: [], simulationCount: 1 });
    expect(result).toEqual(before);
    expect(logger.isEnabled()).toBe(false);
    expect(logger.getLogs()).toEqual([]);
  });

  it('forwards progress and cancellation hooks between battles', () => {
    let completed = 0;
    const result = new CalculatorBattleEngine().run({ ...config(), simulationCount: 10, optimizeDeterministicSimulations: false }, {
      progressInterval: 1,
      onProgress: (progress) => { completed = progress.completed; },
      shouldAbort: () => completed >= 2,
    });
    expect(completed).toBe(2);
    expect(result.playerWins + result.opponentWins + result.draws).toBe(2);
  });

  it('projects end-turn buffs through the packaged engine without mutating the lineup', () => {
    const input = config();
    input.playerPets = [{ name: 'Monkey', attack: 1, health: 2 }, { name: 'Fish', attack: 2, health: 3 }];
    const before = structuredClone(input);
    const projected = new CalculatorBattleEngine().projectLineupAfterEndTurn(input, 'player', input.playerPets);
    expect(projected[0]?.attack).toBeGreaterThan(input.playerPets[0]!.attack!);
    expect(input).toEqual(before);
  });

  it('provides structured engine events through the headless API', () => {
    const result = runHeadlessSimulation(config(), { includeBattles: true });
    expect(result.battles?.[0].logs[0].board).toBeDefined();
    expect(result.battles?.[0].logs.some((log) => log.message.includes('<img'))).toBe(false);
    expect(runHeadlessSimulation(config()).battles).toBeUndefined();
  });
});
