import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Abomination + Caterpillar swallowed level', () => {
  it('transforms when the copied Caterpillar ability is level 3 on a level 2 owner', () => {
    const config = createBaseConfig('Unicorn');

    config.playerPets[0] = createPet('Abomination', {
      attack: 1,
      health: 1,
      exp: 2,
      abominationSwallowedPet1: 'Humphead Wrasse',
      abominationSwallowedPet1Level: 3,
      abominationSwallowedPet2: 'Caterpillar',
      abominationSwallowedPet2Level: 3,
    });

    config.opponentPets[0] = createPet('Sloth', {
      attack: 2,
      health: 2,
    });

    const logs = runBattleLogs(config);

    expect(
      logs.some(
        (log) =>
          log.type === 'ability' &&
          String(log.message).includes('transformed into a Butterfly'),
      ),
    ).toBe(true);
  });
});
