import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Giant Isopod prior health buffs', () => {
  it('scales its faint buff from imported prior trigger counts', () => {
    const config = createBaseConfig('Custom');

    config.playerPets[0] = createPet('Giant Isopod', {
      attack: 1,
      health: 1,
      timesGaveHealth: 4,
    });
    config.playerPets[1] = createPet('Fish', {
      attack: 3,
      health: 3,
    });
    config.opponentPets[0] = createPet('Fish', {
      attack: 50,
      health: 50,
    });

    const logs = runBattleLogs(config);
    const giantIsopodLog = logs.find(
      (log) =>
        typeof log?.message === 'string' &&
        log.message.includes('Giant Isopod gave 1 friends +4 health.'),
    );

    expect(giantIsopodLog).toBeDefined();
  });
});
