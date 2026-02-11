import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('popcorn missing pool regression', () => {
  it('still summons when the configured pack has no tier pool', () => {
    const config: SimulationConfig = {
      playerPack: 'MissingPack',
      opponentPack: 'Danger',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        {
          name: 'Budgie',
          attack: 1,
          health: 1,
          exp: 0,
          equipment: { name: 'Popcorn' },
        },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Bombus Dahlbomii', attack: 1, health: 2, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toMatch(/Budgie Spawned .* \(Popcorn\)/);
  });
});
