import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Banggai Cardinalfish minimum attack', () => {
  it('does not raise pets that already have less than 4 attack', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Danger',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Banggai Cardinalfish', attack: 6, health: 50, exp: 0 },
        { name: 'Ant', attack: 2, health: 50, exp: 0 },
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Fish', attack: 3, health: 50, exp: 0 },
        { name: 'Pig', attack: 10, health: 50, exp: 0 },
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const banggaiLogs = logs
      .map((log) => log.message)
      .filter((message) => message.includes('Banggai Cardinalfish reduced'));

    expect(banggaiLogs).toContain(
      'Banggai Cardinalfish reduced Ant attack by 6 to 2.',
    );
    expect(banggaiLogs).toContain(
      'Banggai Cardinalfish reduced Fish attack by 6 to 3.',
    );
    expect(banggaiLogs).toContain(
      'Banggai Cardinalfish reduced Pig attack by 6 to 4.',
    );
  });
});
