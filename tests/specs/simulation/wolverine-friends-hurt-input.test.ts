import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Wolverine friends hurt input', () => {
  it('uses manual friends hurt count for its four-friends-hurt trigger', () => {
    const config = createBaseConfig('Turtle');

    config.playerPets[0] = createPet('Wolverine', {
      attack: 5,
      health: 7,
      friendsHurtBeforeBattle: 4,
    });
    config.opponentPets[0] = createPet('Fish', {
      attack: 1,
      health: 10,
    });

    const logs = runBattleLogs(config);
    const wolverineLog = logs.find(
      (log) =>
        typeof log?.message === 'string' &&
        log.message.includes('Wolverine reduced Fish health by 3'),
    );

    expect(wolverineLog).toBeDefined();
  });
});
