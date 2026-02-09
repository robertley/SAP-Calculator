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
});


