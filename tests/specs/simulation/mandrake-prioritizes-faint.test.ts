import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from '../../support/battle-test-runtime';

function createMandrakePriorityConfig() {
  const config = createBaseConfig('Custom');
  config.playerPets[0] = createPet('Mandrake', { attack: 4, health: 3, exp: 0 });
  config.opponentPets[0] = createPet('Cricket', { attack: 1, health: 2 });
  config.opponentPets[1] = createPet('Fish', { attack: 2, health: 3 });
  return config;
}

describe('Mandrake targeting', () => {
  it('prioritizes enemies with faint abilities', () => {
    for (let i = 0; i < 20; i++) {
      const logs = runBattleLogs(createMandrakePriorityConfig());
      const dazedLog = logs.find(
        (log) =>
          log.type === 'ability' &&
          typeof log.message === 'string' &&
          log.message.includes('Mandrake made') &&
          log.message.includes('Dazed'),
      );

      expect(dazedLog).toBeDefined();
      expect(String(dazedLog?.message ?? '')).toContain('Cricket');
    }
  });

  it('does not target tier 5 faint pets at level 2', () => {
    const config = createBaseConfig('Custom');
    config.playerPets[0] = createPet('Mandrake', {
      attack: 4,
      health: 3,
      exp: 2,
    });
    config.opponentPets[0] = createPet('Nyala', { attack: 3, health: 4 });

    const logs = runBattleLogs(config);

    expect(
      logs.some(
        (log) =>
          log.type === 'ability' &&
          typeof log.message === 'string' &&
          log.message.includes('Mandrake made') &&
          log.message.includes('Dazed'),
      ),
    ).toBe(false);
  });

  it('prioritizes Chameleon after it copies Melon Helmet as a faint ability', () => {
    for (let i = 0; i < 20; i++) {
      const config = createBaseConfig('Puppy');
      config.seed = 1000 + i;
      config.playerToy = 'Melon Helmet';
      config.playerToyLevel = 1;
      config.playerPets[0] = createPet('Fish', { attack: 3, health: 8 });
      config.playerPets[1] = createPet('Chameleon', {
        attack: 6,
        health: 9,
        exp: 2,
      });
      config.opponentPets[0] = createPet('Mandrake', {
        attack: 4,
        health: 3,
        exp: 2,
      });

      const logs = runBattleLogs(config);
      const dazedLog = logs.find(
        (log) =>
          log.type === 'ability' &&
          typeof log.message === 'string' &&
          log.message.includes('Mandrake made') &&
          log.message.includes('Dazed'),
      );

      expect(dazedLog).toBeDefined();
      expect(String(dazedLog?.message ?? '')).toContain('Chameleon');
    }
  });
});


