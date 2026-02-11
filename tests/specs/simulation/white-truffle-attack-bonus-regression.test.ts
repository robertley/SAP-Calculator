import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('white truffle attack bonus regression', () => {
  it('gains +4 attack before the jump-attack trigger resolves', () => {
    const config: SimulationConfig = {
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Pig', attack: 1, health: 1, exp: 0 },
        {
          name: 'Fish',
          attack: 1,
          health: 5,
          exp: 0,
          equipment: { name: 'White Truffle' },
        },
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Hippo', attack: 2, health: 10, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Fish gained 4 attack (White Truffle)');
    expect(joinedLogs).toContain('Fish jump-attacks Hippo for 5. (White Truffle)');
  });
});
