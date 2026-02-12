import { describe, expect, it } from 'vitest';
import { createBaseConfig, createPet, runBattleLogs } from '../../support/battle-test-runtime';

function getKakapoTargets(logs: Array<{ type?: string; message?: string }>, effect: 'gave' | 'pushed'): string[] {
  const verb = effect === 'gave' ? 'gave' : 'pushed';
  const pattern =
    effect === 'gave'
      ? /^Kakapo gave (.+) Spooked\.$/
      : /^Kakapo pushed (.+) to the back\.$/;

  return logs
    .filter((log) => log?.type === 'ability')
    .map((log) => String(log?.message ?? ''))
    .filter((message) => message.startsWith(`Kakapo ${verb} `))
    .map((message) => message.match(pattern)?.[1] ?? '')
    .filter((name) => name.length > 0);
}

describe('Kakapo target order', () => {
  it('at level 2 applies Spooked and push to the lowest-attack selected target first', () => {
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
    const spookedTargets = getKakapoTargets(logs, 'gave');
    const pushedTargets = getKakapoTargets(logs, 'pushed');

    expect(spookedTargets.slice(0, 2)).toEqual(['Pig', 'Fish']);
    expect(pushedTargets.slice(0, 2)).toEqual(['Pig', 'Fish']);
  });

  it('at level 3 applies Spooked and push to the lowest-attack selected target first', () => {
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
    const spookedTargets = getKakapoTargets(logs, 'gave');
    const pushedTargets = getKakapoTargets(logs, 'pushed');

    expect(spookedTargets.slice(0, 3)).toEqual(['Otter', 'Pig', 'Fish']);
    expect(pushedTargets.slice(0, 3)).toEqual(['Otter', 'Pig', 'Fish']);
  });
});

