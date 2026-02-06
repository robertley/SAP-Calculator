import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from './helpers/pilot-runtime';

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
});
