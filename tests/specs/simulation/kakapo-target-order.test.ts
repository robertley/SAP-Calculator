import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from '../../support/battle-test-runtime';

function getKakapoTargets(logs: Array<{ type?: string; message?: string }>): string[] {
  return logs
    .filter((log) => log?.type === 'ability')
    .map((log) => String(log?.message ?? ''))
    .filter((message) => message.startsWith('Kakapo made '))
    .map((message) => message.match(/^Kakapo made (.+) Cowardly\.$/)?.[1] ?? '')
    .filter((name) => name.length > 0);
}

describe('Kakapo target order', () => {
  it('at level 2 makes the two highest attack enemies Cowardly', () => {
    const config = createBaseConfig('Danger');
    config.playerPets[0] = createPet('Kakapo', {
      exp: 2,
      attack: 6,
      health: 10,
    });

    config.opponentPets[0] = createPet('Ant', { attack: 1, health: 50 });
    config.opponentPets[1] = createPet('Fish', { attack: 9, health: 10 });
    config.opponentPets[2] = createPet('Pig', { attack: 7, health: 10 });
    config.opponentPets[3] = createPet('Otter', { attack: 5, health: 10 });

    const logs = runBattleLogs(config);
    const cowardlyTargets = getKakapoTargets(logs);

    expect(cowardlyTargets.slice(0, 2)).toEqual(['Fish', 'Pig']);
  });

  it('at level 3 makes the three highest attack enemies Cowardly', () => {
    const config = createBaseConfig('Danger');
    config.playerPets[0] = createPet('Kakapo', {
      exp: 5,
      attack: 6,
      health: 10,
    });

    config.opponentPets[0] = createPet('Ant', { attack: 1, health: 50 });
    config.opponentPets[1] = createPet('Fish', { attack: 9, health: 10 });
    config.opponentPets[2] = createPet('Pig', { attack: 7, health: 10 });
    config.opponentPets[3] = createPet('Otter', { attack: 5, health: 10 });
    config.opponentPets[4] = createPet('Beaver', { attack: 2, health: 10 });

    const logs = runBattleLogs(config);
    const cowardlyTargets = getKakapoTargets(logs);

    expect(cowardlyTargets.slice(0, 3)).toEqual(['Fish', 'Pig', 'Otter']);
  });
});
