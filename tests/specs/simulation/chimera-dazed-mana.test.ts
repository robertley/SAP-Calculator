import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Chimera mana while Dazed', () => {
  it('uses mana on faint even though Dazed prevents the Chimera ability', () => {
    const config = createBaseConfig('Unicorn');
    config.playerPets[0] = createPet('Chimera', {
      attack: 1,
      health: 1,
      mana: 6,
      equipment: { name: 'Dazed' },
    });
    config.opponentPets[0] = createPet('Elephant', {
      attack: 10,
      health: 20,
    });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log.message ?? ''));

    expect(messages).toContain(
      "Chimera's ability was not activated because of Dazed.",
    );
    expect(messages).toContain('Chimera sniped Elephant for 6. (Mana)');
    expect(messages.some((message) => message.includes('Chimera Lion'))).toBe(
      false,
    );
  });
});
