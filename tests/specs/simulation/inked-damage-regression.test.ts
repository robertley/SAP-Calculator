import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Inked damage reduction', () => {
  it('does not double-count regular Ink on normal attacks from a level 2 Cuttlefish', () => {
    const config = createBaseConfig('Golden');

    config.playerPets[0] = createPet('Cuttlefish', {
      attack: 1,
      health: 1,
      exp: 2,
    });
    config.playerPets[1] = createPet('Ant', {
      attack: 1,
      health: 20,
    });
    config.opponentPets[0] = createPet('Ant', {
      attack: 10,
      health: 20,
    });

    const logs = runBattleLogs(config);
    const inkedAttackLog = logs.find(
      (log) =>
        log.type === 'attack' &&
        typeof log.message === 'string' &&
        log.message.includes('Ant attacks Ant for') &&
        log.message.includes('(Inked -3)'),
    );

    expect(inkedAttackLog).toBeDefined();
    expect(String(inkedAttackLog?.message ?? '')).toContain(
      'Ant attacks Ant for 7.',
    );
  });

  it('still reduces ability damage from an Inked pet by 3', () => {
    const config = createBaseConfig('Star');

    config.playerPets[0] = createPet('Pig', {
      attack: 6,
      health: 3,
      exp: 2,
    });
    config.playerPets[1] = createPet('Hippo', {
      attack: 5,
      health: 8,
    });
    config.playerPets[2] = createPet('Kangaroo', {
      attack: 4,
      health: 6,
      exp: 2,
    });
    config.opponentPets[0] = createPet('Firefly', {
      attack: 5,
      health: 4,
      exp: 2,
      equipment: { name: 'Inked' },
    });
    config.opponentPets[1] = createPet('Kiwi', {
      attack: 3,
      health: 6,
      exp: 2,
      equipment: { name: 'Strawberry' },
    });

    const logs = runBattleLogs(config);
    const snipeLog = logs.find(
      (log) =>
        log.type === 'attack' &&
        typeof log.message === 'string' &&
        log.message.includes('Firefly sniped Pig for'),
    );

    expect(snipeLog).toBeDefined();
    expect(String(snipeLog?.message ?? '')).toContain('Firefly sniped Pig for 0.');
  });
});
