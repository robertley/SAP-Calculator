import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('frost wolf and vampire bat regression', () => {
  it('applies stronger Cold at higher Frost Wolf levels and heals Vampire Bat based on capped damage dealt', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Frost Wolf', attack: 1, health: 1, exp: 2 },
        { name: 'Vampire Bat', attack: 2, health: 5, exp: 5 },
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Parrot', attack: 10, health: 20, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Frost Wolf made Parrot Cold twice for double effect.');
    expect(joinedLogs).toContain('Vampire Bat sniped Parrot for 22. (Cold +10)');
    expect(joinedLogs).toContain('Vampire Bat gave Vampire Bat 19 health.');
  });
});
