import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';
import { getLogActorLabel } from '../../../src/app/ui/shell/simulation/app.component.simulation-log';

describe('experience and level-up log order', () => {
  it('logs each experience award before the level-up and listeners it causes', () => {
    const config: SimulationConfig = {
      playerPack: 'Star',
      opponentPack: 'Star',
      turn: 13,
      simulationCount: 1,
      logsEnabled: true,
      maxLoggedBattles: 1,
      playerPets: [
        {
          name: 'Cockroach',
          attack: 1,
          health: 1,
          exp: 5,
          equipment: null,
        },
        {
          name: 'Clownfish',
          attack: 3,
          health: 4,
          exp: 5,
          equipment: null,
        },
        {
          name: 'Team Spirit',
          attack: 4,
          health: 5,
          exp: 5,
          equipment: null,
        },
        {
          name: 'Flying Fish',
          attack: 5,
          health: 2,
          exp: 5,
          equipment: null,
        },
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 50, health: 50, exp: 0, equipment: null },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const messages = (result.battles?.[0]?.logs ?? []).map((log) =>
      String(log.rawMessage ?? log.message),
    );
    const relevantMessages = messages.filter(
      (message) =>
        message === 'Cockroach gave Summoned Cockroach +3 exp.' ||
        message === 'Summoned Cockroach leveled up to level 2.' ||
        message ===
          'Clownfish gave Summoned Cockroach 6 attack and 6 health.' ||
        message === 'Flying Fish gave Summoned Cockroach +6 experience.' ||
        message === 'Summoned Cockroach leveled up to level 3.',
    );

    expect(relevantMessages).toEqual([
      'Cockroach gave Summoned Cockroach +3 exp.',
      'Summoned Cockroach leveled up to level 2.',
      'Clownfish gave Summoned Cockroach 6 attack and 6 health.',
      'Flying Fish gave Summoned Cockroach +6 experience.',
      'Summoned Cockroach leveled up to level 3.',
      'Clownfish gave Summoned Cockroach 6 attack and 6 health.',
    ]);

    const logs = result.battles?.[0]?.logs ?? [];
    const findLog = (message: string) =>
      logs.find((log) => String(log.rawMessage ?? log.message) === message);

    const cockroachAward = findLog(
      'Cockroach gave Summoned Cockroach +3 exp.',
    );
    expect(cockroachAward).toMatchObject({
      sourceIndex: 1,
      targetIndex: 1,
    });
    expect(getLogActorLabel(cockroachAward!, 'source')).toBe('P1 Cockroach');
    expect(getLogActorLabel(cockroachAward!, 'target')).toBe(
      'P1 Summoned Cockroach',
    );

    const clownfishListener = findLog(
      'Clownfish gave Summoned Cockroach 6 attack and 6 health.',
    );
    expect(clownfishListener).toMatchObject({
      sourceIndex: 2,
      targetIndex: 1,
    });
    expect(getLogActorLabel(clownfishListener!, 'source')).toBe('P2 Clownfish');
    expect(getLogActorLabel(clownfishListener!, 'target')).toBe(
      'P1 Summoned Cockroach',
    );

    const teamSpiritListener = findLog(
      'Team Spirit gave Flying Fish 3 attack and 3 health.',
    );
    expect(teamSpiritListener).toMatchObject({
      sourceIndex: 3,
      targetIndex: 4,
      targetPet: {
        parent: {
          isOpponent: false,
        },
      },
    });
    expect(getLogActorLabel(teamSpiritListener!, 'source')).toBe(
      'P3 Team Spirit',
    );
    expect(getLogActorLabel(teamSpiritListener!, 'target')).toBe(
      'P4 Flying Fish',
    );

    const flyingFishAward = findLog(
      'Flying Fish gave Summoned Cockroach +6 experience.',
    );
    expect(flyingFishAward).toMatchObject({
      sourceIndex: 4,
      targetIndex: 1,
    });
    expect(getLogActorLabel(flyingFishAward!, 'source')).toBe(
      'P4 Flying Fish',
    );
    expect(getLogActorLabel(flyingFishAward!, 'target')).toBe(
      'P1 Summoned Cockroach',
    );
  });
});
