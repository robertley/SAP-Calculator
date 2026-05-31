import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('ailment count input', () => {
  it('lets Estemmenosuchus use a manual ailment count when fainting', () => {
    const config = createBaseConfig('Custom');

    config.playerPets[0] = createPet('Estemmenosuchus', {
      attack: 1,
      health: 1,
      ailmentsCount: 4,
    });
    config.opponentPets[0] = createPet('Fish', {
      attack: 10,
      health: 10,
    });

    const logs = runBattleLogs(config);
    const summonLog = logs.find(
      (log) =>
        typeof log?.message === 'string' &&
        log.message.includes(
          'Estemmenosuchus summoned 1 3/3 friend with +4/+4.',
        ),
    );

    expect(summonLog).toBeDefined();
  });
});
