import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

describe('Tasmanian Devil and Mole regressions', () => {
  it('Tasmanian Devil level 1 applies 5x Spooked for jump attack damage', () => {
    const config = createBaseConfig('Danger');

    config.playerPets[0] = createPet('Tasmanian Devil', {
      attack: 1,
      health: 5,
      exp: 0,
    });

    config.opponentPets[0] = createPet('Ant', { attack: 1, health: 20 });
    config.opponentPets[1] = createPet('Fish', { attack: 7, health: 20 });

    const logs = runBattleLogs(config);

    const spookedLog = logs.find((log) =>
      String(log?.message ?? '').includes('Tasmanian Devil gave Ant 5x Spooked.'),
    );
    const jumpAttackLog = logs.find((log) =>
      String(log?.message ?? '').includes('Tasmanian Devil jump-attacks Ant for 6.'),
    );

    expect(spookedLog).toBeDefined();
    expect(jumpAttackLog).toBeDefined();
  });

  it('Mole does not consume Inked ailments as perks when fainting', () => {
    const config = createBaseConfig('Puppy');

    config.playerPets[0] = createPet('Mole', {
      attack: 2,
      health: 1,
      exp: 0,
    });
    config.playerPets[1] = createPet('Ant', {
      attack: 2,
      health: 10,
      equipment: { name: 'Inked' },
    });
    config.playerPets[2] = createPet('Fish', {
      attack: 2,
      health: 10,
      equipment: { name: 'Inked' },
    });

    config.opponentPets[0] = createPet('Elephant', {
      attack: 50,
      health: 50,
      exp: 0,
    });

    const logs = runBattleLogs(config);
    const messages = logs.map((log) => String(log?.message ?? ''));

    expect(messages.some((m) => m.includes("Mole removed") && m.includes("'s perk."))).toBe(false);
    expect(messages.some((m) => m.includes('Mole summoned a 6/6 Mole.'))).toBe(false);
  });
});
