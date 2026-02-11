import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('custom pack popcorn pool regression', () => {
  it('uses the selected custom pack pool for popcorn summons', () => {
    const config: SimulationConfig = {
      playerPack: 'RandomWeekly',
      opponentPack: 'RandomWeekly',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      customPacks: [
        {
          name: 'RandomWeekly',
          tier1Pets: ['Manticore'],
          tier2Pets: [],
          tier3Pets: [],
          tier4Pets: [],
          tier5Pets: [],
          tier6Pets: [],
          spells: [],
        },
      ],
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
        {
          name: 'Bombus Dahlbomii',
          attack: 3,
          health: 9,
          exp: 0,
        },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Budgie Spawned Manticore (Popcorn)');
  });
});
