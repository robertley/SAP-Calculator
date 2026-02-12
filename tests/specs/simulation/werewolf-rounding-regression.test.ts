import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('werewolf rounding regression', () => {
  it('rounds down gained stats at night after applying the buff', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 12,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Werewolf', attack: 3, health: 3, exp: 0 },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 1, health: 1, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Werewolf increased Werewolf\'s stats by 50% (4/4).');
    expect(joinedLogs).not.toContain('Werewolf 4.5/4.5');
  });

  it('uses turn parity and mana mode: odd turn with mana enabled grants mana', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 11,
      mana: true,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Werewolf', attack: 3, health: 3, exp: 0 },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 1, health: 1, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Werewolf gave Werewolf 6 mana.');
    expect(joinedLogs).not.toContain('Werewolf increased Werewolf\'s stats by 50% (4/4).');
  });

  it('uses turn parity and mana mode: odd turn with mana disabled applies stat buff', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 11,
      mana: false,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        { name: 'Werewolf', attack: 3, health: 3, exp: 0 },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 1, health: 1, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs?.map((log) => log.message ?? '') ?? [];
    const joinedLogs = logs.join('\n');

    expect(joinedLogs).toContain('Werewolf increased Werewolf\'s stats by 50% (4/4).');
  });
});
