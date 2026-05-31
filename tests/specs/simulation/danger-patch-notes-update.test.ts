import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Danger patch notes update', () => {
  it('Takin buffs itself and triples every third adjacent friend attack trigger', () => {
    const config = createBaseConfig('Danger');
    config.playerPets[0] = createPet('Pig', {
      attack: 1,
      health: 30,
    });
    config.playerPets[1] = createPet('Takin', {
      attack: 2,
      health: 30,
    });
    config.opponentPets[0] = createPet('Fish', {
      attack: 1,
      health: 30,
    });

    const logs = runBattleLogs(config);
    const takinBuffs = logs
      .map((log) => String(log.message ?? ''))
      .filter((message) => message.startsWith('Takin gave Takin '));

    expect(takinBuffs).toContain('Takin gave Takin 1 attack and 1 health.');
    expect(takinBuffs).toContain('Takin gave Takin 3 attack and 3 health.');
  });

  it('Geechee Red Pea removes attack from the attack target before attacking', () => {
    const config = createBaseConfig('Danger');
    config.playerPets[0] = createPet('Ant', {
      attack: 6,
      health: 20,
      equipment: 'Geechee Red Pea',
    });
    config.opponentPets[0] = createPet('Fish', {
      attack: 10,
      health: 20,
    });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log.message ?? ''));

    expect(messages).toContain(
      'Ant removed 5 attack from Fish. (Geechee Red Pea)',
    );
    expect(messages).toContain('Fish attacks Ant for 5.');
  });
});
