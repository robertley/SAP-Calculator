import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from '../../support/battle-test-runtime';

describe('Fly + Mushroom Ordering', () => {
  it('spawns Zombie Fly in front of a Mushroom-respawned Snake', () => {
    const config = createBaseConfig('Turtle');
    config.playerPets[0] = createPet('Hippo', { attack: 12, health: 12 });
    config.opponentPets[0] = createPet('Snake', {
      attack: 8,
      health: 3,
      equipment: { name: 'Mushroom' },
    });
    config.opponentPets[1] = createPet('Fly', { attack: 4, health: 4 });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    const firstSnakeFaint = messages.indexOf('Snake fainted.');
    expect(firstSnakeFaint).toBeGreaterThan(-1);

    const mushroomSpawn = messages.findIndex(
      (message, idx) =>
        idx > firstSnakeFaint &&
        message.includes('Snake Spawned Snake') &&
        message.includes('(Mushroom)'),
    );
    expect(mushroomSpawn).toBeGreaterThan(-1);

    const zombieSpawn = messages.findIndex(
      (message, idx) => idx > mushroomSpawn && message.includes('Fly spawned Zombie Fly'),
    );
    expect(zombieSpawn).toBeGreaterThan(-1);

    const boardAfterZombieSpawn = messages.find(
      (message, idx) => idx > zombieSpawn && message.includes(' | O1 '),
    );
    expect(boardAfterZombieSpawn).toBeTruthy();
    expect(boardAfterZombieSpawn).toContain('alt="Zombie Fly"');
    expect(boardAfterZombieSpawn).toContain('O2 <img src="assets/art/Public/Public/Pets/Snake.png"');
  });

  it('spawns level 2 Zombie Fly as 8/8', () => {
    const config = createBaseConfig('Turtle');
    config.playerPets[0] = createPet('Hippo', { attack: 10, health: 50 });
    config.opponentPets[0] = createPet('Ant', { attack: 1, health: 1 });
    config.opponentPets[1] = createPet('Fly', { attack: 4, health: 50, exp: 2 });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    const zombieSpawn = messages.findIndex((message) =>
      message.includes('Fly spawned Zombie Fly Level 2'),
    );
    expect(zombieSpawn).toBeGreaterThan(-1);

    const boardAfterZombieSpawn = messages.find(
      (message, idx) => idx > zombieSpawn && message.includes(' | O1 '),
    );
    expect(boardAfterZombieSpawn).toBeTruthy();
    expect(boardAfterZombieSpawn).toContain('alt="Zombie Fly">(8/8/2xp)');
  });

  it('does not spend a Parrot-copied Fly trigger when Parrot copies Fly', () => {
    const config = createBaseConfig('Turtle');
    config.turn = 13;
    config.mana = true;
    config.playerPets = [
      createPet('Badger', {
        attack: 12,
        health: 9,
        exp: 2,
        equipment: { name: 'Melon' },
      }),
      createPet('Mammoth', {
        attack: 8,
        health: 16,
        exp: 3,
        equipment: { name: 'Mushroom' },
      }),
      createPet('Whale', {
        attack: 4,
        health: 15,
        equipment: { name: 'Bread' },
      }),
      createPet('Boar', {
        attack: 12,
        health: 9,
        equipment: { name: 'Melon' },
      }),
      createPet('Shark', {
        attack: 7,
        health: 16,
        exp: 2,
        equipment: { name: 'Bread' },
      }),
    ];
    config.opponentPets = [
      createPet('Fish', {
        attack: 18,
        health: 21,
        exp: 2,
        equipment: { name: 'Melon' },
      }),
      createPet('Snake', { attack: 10, health: 6 }),
      createPet('Boar', {
        attack: 16,
        health: 13,
        exp: 2,
        equipment: { name: 'Melon' },
      }),
      createPet('Fly', {
        attack: 7,
        health: 7,
        equipment: { name: 'Mushroom' },
      }),
      createPet('Parrot', {
        attack: 11,
        health: 16,
        exp: 2,
        equipment: { name: 'Bread' },
      }),
    ];

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    expect(
      messages.filter((message) =>
        message.includes("Parrot's Fly spawned Zombie Fly"),
      ),
    ).toHaveLength(3);
  });
});


