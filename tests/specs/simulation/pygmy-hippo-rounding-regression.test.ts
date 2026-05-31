import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Pygmy Hippo rounding regression', () => {
  it('rounds damage up from 33% of current health', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Turtle',
      turn: 3,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Ant', attack: 1, health: 50, exp: 0 },
        { name: 'Pygmy Hippo', attack: 2, health: 5, exp: 0 },
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Fish', attack: 1, health: 50, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Pygmy Hippo sniped Fish for 2.');
    expect(joinedLogs).not.toContain('Pygmy Hippo sniped Fish for 1.');
  });
});
