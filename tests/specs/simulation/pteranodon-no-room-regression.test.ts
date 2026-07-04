import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Pteranodon no-room friend faint trigger', () => {
  it('does not spend a trigger when a preceding Beluga spawn leaves no room', () => {
    const config = createBaseConfig('Golden');
    config.turn = 22;
    config.playerRollAmount = 7;
    config.opponentLevel3Sold = 1;
    config.seed = 1;

    config.playerPets = [
      createPet('Beluga Whale', {
        attack: 6,
        health: 9,
        exp: 2,
        equipment: { name: 'Chocolate Cake' },
        belugaSwallowedPet: 'Cuttlefish',
      }),
      createPet('Nyala', {
        attack: 7,
        health: 8,
        exp: 4,
        equipment: { name: 'Chocolate Cake' },
      }),
      createPet('Nurse Shark', {
        attack: 7,
        health: 9,
        exp: 2,
        equipment: { name: 'Chocolate Cake' },
      }),
      createPet('Pteranodon', {
        attack: 12,
        health: 14,
        exp: 5,
        equipment: { name: 'Durian' },
      }),
      createPet('Poison Dart Frog', {
        attack: 24,
        health: 21,
        exp: 5,
        equipment: { name: 'Pita Bread' },
      }),
    ];
    config.opponentPets = [
      createPet('Mammoth', {
        attack: 13,
        health: 21,
        exp: 5,
        equipment: { name: 'Mushroom' },
      }),
      createPet('Whale', {
        attack: 12,
        health: 16,
        exp: 4,
        equipment: { name: 'Melon' },
      }),
      createPet('Ox', {
        attack: 17,
        health: 22,
        exp: 2,
        equipment: { name: 'Melon' },
      }),
      createPet('Fly', {
        attack: 13,
        health: 13,
        exp: 5,
        equipment: { name: 'Melon' },
      }),
      createPet('Deer', {
        attack: 12,
        health: 12,
        exp: 2,
        equipment: { name: 'Mushroom' },
      }),
    ];

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log.message ?? ''));

    expect(
      messages.some((message) =>
        message.includes('Beluga Whale spawned Cuttlefish Level 3'),
      ),
    ).toBe(true);
    expect(messages).not.toContain('No room to spawn Beluga Whale!');
    expect(
      messages.some((message) =>
        message.includes('Pteranodon summoned a 1/1 Nurse Shark behind it.'),
      ),
    ).toBe(true);
  });
});
