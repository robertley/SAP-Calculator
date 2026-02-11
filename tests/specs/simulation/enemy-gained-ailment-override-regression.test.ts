import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('enemy gained ailment override regression', () => {
  it('does not trigger EnemyGainedAilment when White Okra destroys the ailment', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Turtle',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Visitor', attack: 1, health: 1, exp: 0 },
        { name: 'Vampire Bat', attack: 2, health: 5, exp: 2 },
        null,
        null,
        null,
      ],
      opponentPets: [
        {
          name: 'Camel',
          attack: 10,
          health: 20,
          exp: 0,
          equipment: { name: 'White Okra' },
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

    expect(joinedLogs).toContain('blocked Icky');
    expect(joinedLogs).not.toMatch(/Vampire Bat.*sniped/);
  });

  it('triggers EnemyGainedAilment when ailment lands by replacing a perk', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Turtle',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Visitor', attack: 1, health: 1, exp: 0 },
        { name: 'Vampire Bat', attack: 2, health: 5, exp: 2 },
        null,
        null,
        null,
      ],
      opponentPets: [
        {
          name: 'Camel',
          attack: 10,
          health: 20,
          exp: 0,
          equipment: { name: 'Garlic' },
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

    expect(joinedLogs).toMatch(/Visitor.*made.*Icky/);
    expect(joinedLogs).toMatch(/Vampire Bat.*sniped/);
  });
});
