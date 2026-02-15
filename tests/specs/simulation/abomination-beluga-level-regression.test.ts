import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Abomination + Beluga swallowed level', () => {
  it('does not inherit slot 1 level for a slot 3 Beluga when slot 3 level is unset', () => {
    const config = createBaseConfig('Custom');

    config.playerPets[0] = createPet('Abomination', {
      attack: 1,
      health: 1,
      exp: 5,
      abominationSwallowedPet1: 'Behemoth',
      abominationSwallowedPet1Level: 3,
      abominationSwallowedPet2: 'Guineafowl',
      abominationSwallowedPet3: 'Beluga Whale',
      abominationSwallowedPet3BelugaSwallowedPet: 'Slug',
    });

    config.opponentPets[0] = createPet('Ant', {
      attack: 50,
      health: 50,
    });

    const logs = runBattleLogs(config);
    const slugSpawnLog = logs.find(
      (log) =>
        log.type === 'ability' &&
        typeof log.message === 'string' &&
        log.message.includes('spawned Slug Level'),
    );

    expect(slugSpawnLog).toBeDefined();
    expect(String(slugSpawnLog?.message ?? '')).toContain('spawned Slug Level 1');
  });
});
