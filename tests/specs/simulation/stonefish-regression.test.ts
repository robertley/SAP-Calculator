import { describe, expect, it } from 'vitest';
import { runSimulation } from '../../../simulation/simulate';
import {
  createBaseConfig,
  createPet,
} from '../../support/battle-test-runtime';

describe('Stonefish regressions', () => {
  it('retaliates against the pet that caused its faint', () => {
    const config = createBaseConfig('Puppy');
    config.opponentPack = 'Unicorn';
    config.playerPets[0] = createPet('Stonefish', {
      attack: 16,
      health: 10,
    });
    config.playerPets[1] = createPet('Ant', {
      attack: 1,
      health: 10,
    });
    config.opponentPets[0] = createPet('Ogopogo', {
      attack: 20,
      health: 28,
    });

    const result = runSimulation({
      ...config,
      logsEnabled: true,
      maxLoggedBattles: 1,
    });
    const messages = (result.battles?.[0]?.logs ?? []).map((log) =>
      String(log.message ?? ''),
    );

    expect(messages).toContain('Stonefish sniped Ogopogo for 16.');
    expect(result.playerWins).toBe(1);
  });
});
