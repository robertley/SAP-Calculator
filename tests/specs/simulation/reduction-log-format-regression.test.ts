import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('reduction log format regression', () => {
  it('Humphead Wrasse reduction log uses "to <value>" with no parentheses', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Danger',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Humphead Wrasse', attack: 6, health: 4, exp: 0 },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Geometric Tortoise', attack: 12, health: 16, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const reductionLog = logs.find(
      (log) =>
        typeof log.message === 'string' &&
        log.message.includes('reduced') &&
        log.message.includes('attack by'),
    );

    expect(reductionLog).toBeDefined();
    expect(reductionLog?.message).toContain(' to ');
    expect(reductionLog?.message).not.toContain('(');
  });

  it('Skunk reduction log uses "to <value>" with no parentheses', () => {
    const config: SimulationConfig = {
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Skunk', attack: 3, health: 5, exp: 0 },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Elephant', attack: 10, health: 10, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const reductionLog = logs.find(
      (log) =>
        typeof log.message === 'string' &&
        log.message.includes('reduced') &&
        log.message.includes('health by'),
    );

    expect(reductionLog).toBeDefined();
    expect(reductionLog?.message).toContain(' to ');
    expect(reductionLog?.message).not.toContain('(');
  });
});
