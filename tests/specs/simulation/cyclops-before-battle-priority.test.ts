import { describe, expect, it } from 'vitest';
import { runSimulation, type SimulationConfig } from '../../../simulation/simulate';

describe('Cyclops before battle priority', () => {
  it('resolves all BeforeStartBattle effects before Cyclops reacts to a level up', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 12,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      tokenPets: true,
      mana: true,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        {
          name: 'Ant',
          attack: 10,
          health: 10,
          exp: 1,
          equipment: { name: 'Gingerbread Man' },
        },
        {
          name: 'Fish',
          attack: 1,
          health: 10,
          exp: 0,
          equipment: { name: 'Health Potion' },
        },
        {
          name: 'Cyclops',
          attack: 2,
          health: 5,
          exp: 0,
        },
      ],
      opponentPets: [
        { name: 'Pig', attack: 1, health: 50, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const messages = (result.battles?.[0]?.logs ?? []).map((log) =>
      String(log?.message ?? ''),
    );

    const gingerbreadIdx = messages.findIndex((message) =>
      message.includes('Ant gained 1 experience (Gingerbread Man).'),
    );
    const healthPotionIdx = messages.findIndex((message) =>
      message.includes('Fish gave 2 health to Ant (Health Potion).'),
    );
    const cyclopsIdx = messages.findIndex((message) =>
      message.includes('Cyclops gave Ant 2 mana.'),
    );

    expect(gingerbreadIdx).toBeGreaterThan(-1);
    expect(healthPotionIdx).toBeGreaterThan(-1);
    expect(cyclopsIdx).toBeGreaterThan(-1);
    expect(gingerbreadIdx).toBeLessThan(healthPotionIdx);
    expect(healthPotionIdx).toBeLessThan(cyclopsIdx);
  });
});
