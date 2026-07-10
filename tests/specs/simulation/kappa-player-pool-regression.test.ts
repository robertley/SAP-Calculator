import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Kappa owner pool', () => {
  it('uses its owner pack for both Tier 3 summons', () => {
    const config: SimulationConfig = {
      playerPack: 'PlayerPool',
      opponentPack: 'OpponentPool',
      turn: 9,
      simulationCount: 1,
      logsEnabled: true,
      captureRandomDecisions: true,
      maxLoggedBattles: 1,
      customPacks: [
        {
          name: 'PlayerPool',
          tier1Pets: [],
          tier2Pets: [],
          tier3Pets: ['Manticore', 'Hydra'],
          tier4Pets: [],
          tier5Pets: [],
          tier6Pets: [],
          spells: [],
        },
        {
          name: 'OpponentPool',
          tier1Pets: [],
          tier2Pets: [],
          tier3Pets: ['Ant', 'Fish'],
          tier4Pets: [],
          tier5Pets: ['Kappa'],
          tier6Pets: [],
          spells: [],
        },
      ],
      playerPets: [
        { name: 'Ant', attack: 20, health: 20, exp: 0, mana: 0 },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Kappa', attack: 1, health: 1, exp: 0, mana: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const decisions = (result.randomDecisions ?? []).filter((entry) =>
      entry.key.startsWith('pet.kappa-'),
    );

    expect(decisions).toHaveLength(2);
    for (const decision of decisions) {
      expect(decision.options.map((option) => option.id)).toEqual([
        'Ant',
        'Fish',
      ]);
    }
  });
});
