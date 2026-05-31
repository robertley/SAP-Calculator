import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Firefly faint damage regression', () => {
  it('damages nearby pets after front pets faint and triggers hurt abilities from that damage', () => {
    const config: SimulationConfig = {
      playerPack: 'Star',
      opponentPack: 'Star',
      turn: 5,
      logsEnabled: true,
      simulationCount: 1,
      mana: true,
      playerGoldSpent: 12,
      opponentGoldSpent: 11,
      playerRollAmount: 3,
      opponentRollAmount: 2,
      playerSummonedAmount: 1,
      opponentSummonedAmount: 2,
      playerPets: [
        { name: 'Pig', attack: 6, health: 3, exp: 2 },
        { name: 'Hippo', attack: 5, health: 8, exp: 0 },
        { name: 'Kangaroo', attack: 4, health: 6, exp: 2 },
        { name: 'Swan', attack: 2, health: 3, exp: 1 },
        { name: 'Rabbit', attack: 1, health: 4, exp: 0, triggersConsumed: 1 },
      ],
      opponentPets: [
        { name: 'Firefly', attack: 5, health: 4, exp: 2 },
        {
          name: 'Kiwi',
          attack: 3,
          health: 6,
          exp: 2,
          equipment: { name: 'Strawberry' },
        },
        { name: 'Dumbo Octopus', attack: 6, health: 8, exp: 1 },
        { name: 'Siamese', attack: 2, health: 5, exp: 0 },
        { name: 'Toad', attack: 4, health: 3, exp: 0 },
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Firefly sniped Kangaroo for 1.');
    expect(joinedLogs).toContain('Kiwi gave Kiwi +2 attack');
  });
});
