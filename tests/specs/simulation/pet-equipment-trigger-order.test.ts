import { describe, expect, it } from 'vitest';
import { runSimulation } from '../../../simulation/simulate';
import { SimulationConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';

describe('pet and equipment trigger order', () => {
  it('executes Minotaur before Crisp when their Phase 4 events tie', () => {
    const config: SimulationConfig = {
      playerPack: 'Turtle',
      opponentPack: 'Unicorn',
      turn: 1,
      mana: true,
      simulationCount: 1,
      logsEnabled: true,
      maxLoggedBattles: 1,
      playerPets: [
        {
          name: 'Ant',
          attack: 2,
          health: 20,
          exp: 0,
          equipment: null,
        },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        {
          name: 'Behemoth',
          attack: 2,
          health: 20,
          exp: 5,
          equipment: null,
        },
        {
          name: 'Minotaur',
          attack: 12,
          health: 2,
          exp: 5,
          equipment: { name: 'Crisp' },
        },
        null,
        null,
        null,
      ],
    };

    const messages =
      runSimulation(config).battles?.[0]?.logs.map((log) => log.message) ?? [];
    const minotaurIndex = messages.findIndex((message) =>
      message.includes('Minotaur gave Minotaur 9 attack and 9 health.'),
    );
    const crispIndex = messages.findIndex((message) =>
      message.includes('Minotaur took 6 damage (Crisp).'),
    );

    expect(minotaurIndex).toBeGreaterThan(-1);
    expect(crispIndex).toBeGreaterThan(-1);
    expect(minotaurIndex).toBeLessThan(crispIndex);
  });

});
