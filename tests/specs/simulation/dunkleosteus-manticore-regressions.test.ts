import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from '../../support/battle-test-runtime';

describe('Dunkleosteus and copied Manticore regressions', () => {
  it('Dunkleosteus skips enemies that already have the ailment when moving it', () => {
    const config = createBaseConfig('Custom');
    config.playerPets[0] = createPet('Dunkleosteus', {
      attack: 6,
      health: 8,
      equipment: { name: 'Weak' },
    });
    config.opponentPets[0] = createPet('Pig', {
      attack: 6,
      health: 12,
      equipment: { name: 'Weak' },
    });
    config.opponentPets[1] = createPet('Fish', { attack: 4, health: 6 });
    config.opponentPets[2] = createPet('Ant', { attack: 2, health: 4 });

    const logs = runBattleLogs(config);
    const dunkleosteusLog = logs.find((log) =>
      String(log.message ?? '').includes('Dunkleosteus moved Weak to'),
    );

    expect(dunkleosteusLog?.message).toContain('Dunkleosteus moved Weak to Fish, Ant.');
  });

  it('Abomination copied Manticore amplifies enemy ailments', () => {
    const config = createBaseConfig('Unicorn');
    config.opponentPack = 'Turtle';
    config.playerPets[0] = createPet('Abomination', {
      attack: 4,
      health: 8,
      abominationSwallowedPet1: 'Manticore',
      abominationSwallowedPet1Level: 1,
    });
    config.opponentPets[0] = createPet('Ant', {
      attack: 1,
      health: 20,
      equipment: { name: 'Weak' },
    });

    const logs = runBattleLogs(config);
    const attackLog = logs.find(
      (log) =>
        log.type === 'attack' &&
        String(log.message ?? '').includes('Abomination attacks Ant for 10.'),
    );

    expect(attackLog?.message).toContain('(Weak +6)');
    expect(attackLog?.message).toContain('x2 (Manticore)');
  });
});
