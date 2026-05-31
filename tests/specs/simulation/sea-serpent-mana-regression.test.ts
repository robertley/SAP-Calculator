import { describe, expect, it } from 'vitest';
import { Ability, AbilityCustomParams } from '../../../src/app/domain/entities/ability.class';
import { SeaSerpent } from '../../../src/app/domain/entities/catalog/pets/unicorn/tier-6/sea-serpent.class';
import { Player } from '../../../src/app/domain/entities/player.class';
import { GameAPI } from '../../../src/app/domain/interfaces/gameAPI.interface';
import { AbilityService } from '../../../src/app/integrations/ability/ability.service';
import { LogService } from '../../../src/app/integrations/log.service';

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
});
