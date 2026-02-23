import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from '../../support/battle-test-runtime';

describe('Slime battles fought summon', () => {
  it('spawns Smaller Slimes on faint based on battles fought', () => {
    const config = createBaseConfig('Custom');

    config.playerPets[0] = createPet('Slime', {
      attack: 1,
      health: 1,
      battlesFought: 10,
    });
    config.opponentPets[0] = createPet('Fish', {
      attack: 10,
      health: 10,
    });

    const logs = runBattleLogs(config);
    const slimeSummonLog = logs.find(
      (log) =>
        typeof log?.message === 'string' &&
        log.message.includes('Slime summoned 5 2/2 Smaller Slimes.'),
    );

    expect(slimeSummonLog).toBeDefined();
  });
});
