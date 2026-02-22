import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Raccoon perk-steal regression', () => {
  it('does not steal ailments from the front enemy', () => {
    const config = createBaseConfig('Custom');

    config.playerPets[0] = createPet('Raccoon', {
      attack: 6,
      health: 6,
      exp: 0,
    });

    config.opponentPets[0] = createPet('Sloth', {
      attack: 1,
      health: 10,
      equipment: { name: 'Inked' },
    });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    expect(
      messages.some((message) =>
        message.includes("Raccoon stole Sloth's equipment. (Inked)"),
      ),
    ).toBe(false);
  });

  it('still steals perks from the front enemy', () => {
    const config = createBaseConfig('Custom');

    config.playerPets[0] = createPet('Raccoon', {
      attack: 6,
      health: 6,
      exp: 0,
    });

    config.opponentPets[0] = createPet('Sloth', {
      attack: 1,
      health: 10,
      equipment: { name: 'Melon' },
    });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    expect(
      messages.some((message) =>
        message.includes("Raccoon stole Sloth's equipment. (Melon)"),
      ),
    ).toBe(true);
  });
});
