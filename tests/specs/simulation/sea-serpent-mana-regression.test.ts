import { describe, expect, it } from 'vitest';
import { Ability, AbilityCustomParams } from '../../../src/app/domain/entities/ability.class';
import { SeaSerpent } from '../../../src/app/domain/entities/catalog/pets/unicorn/tier-6/sea-serpent.class';
import { Player } from '../../../src/app/domain/entities/player.class';
import { GameAPI } from '../../../src/app/domain/interfaces/gameAPI.interface';
import { AbilityService } from '../../../src/app/integrations/ability/ability.service';
import { LogService } from '../../../src/app/integrations/log.service';
import {
  createBaseConfig,
  createPet,
} from '../../support/battle-test-runtime';
import { runSimulation } from '../../../simulation/simulate';

describe('Sea Serpent mana regressions', () => {
  it('does not reuse cached mana from another Sea Serpent owner', () => {
    const logService = new LogService();
    const parent = { isOpponent: false } as Player;
    const serpent = new SeaSerpent(
      logService,
      null as unknown as AbilityService,
      parent,
      6,
      6,
      0,
      2,
    );
    serpent.savedPosition = 0;

    const ability = serpent.abilityList.find(
      (candidate): candidate is Ability =>
        candidate.name === 'SeaSerpentAbility',
    );
    const leakedParams: AbilityCustomParams = { seaSerpentMana: 9 };

    ability?.execute({} as GameAPI, serpent, false, false, leakedParams);

    expect(
      logService
        .getLogs()
        .some((log) => log.message.includes('Sea Serpent spent')),
    ).toBe(false);
  });

  it('targets mana snipes at the most healthy enemies', () => {
    const config = createBaseConfig('Unicorn');
    config.opponentPack = 'Turtle';
    config.playerPets[0] = createPet('Sea Serpent', {
      attack: 1,
      health: 1,
      mana: 6,
      exp: 5,
    });
    config.opponentPets[0] = createPet('Pig', {
      attack: 50,
      health: 30,
    });
    config.opponentPets[1] = createPet('Fish', {
      attack: 1,
      health: 20,
    });
    config.opponentPets[2] = createPet('Ant', {
      attack: 1,
      health: 10,
    });
    config.opponentPets[3] = createPet('Beaver', {
      attack: 1,
      health: 5,
    });

    const result = runSimulation(config);
    const snipeLogs = (result.battles?.[0]?.logs ?? [])
      .map((log) => String(log.message ?? ''))
      .filter((message) => message.startsWith('Sea Serpent sniped '));

    expect(result.randomOverrideError ?? null).toBeNull();
    expect(snipeLogs).toEqual([
      'Sea Serpent sniped Pig for 6.',
      'Sea Serpent sniped Fish for 6.',
      'Sea Serpent sniped Ant for 6.',
      'Sea Serpent sniped Beaver for 6.',
    ]);
  });
});
