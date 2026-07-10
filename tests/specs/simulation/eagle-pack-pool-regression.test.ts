import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Eagle pack pool', () => {
  const baseConfig: SimulationConfig = {
    playerPack: 'EagleOnly',
    opponentPack: 'EagleOnly',
    turn: 9,
    simulationCount: 1,
    logsEnabled: true,
    captureRandomDecisions: true,
    maxLoggedBattles: 1,
    playerPets: [
      { name: 'Eagle', attack: 1, health: 1, exp: 0, mana: 0 },
      null,
      null,
      null,
      null,
    ],
    opponentPets: [
      { name: 'Ant', attack: 20, health: 20, exp: 0, mana: 0 },
      null,
      null,
      null,
      null,
    ],
    customPacks: [
      {
        name: 'EagleOnly',
        tier1Pets: [],
        tier2Pets: [],
        tier3Pets: [],
        tier4Pets: [],
        tier5Pets: ['Eagle'],
        tier6Pets: ['Manticore', 'Hydra'],
        spells: [],
      },
    ],
  };

  it('summons only pets from its owner\'s next-tier pack pool', () => {
    const result = runSimulation(baseConfig);
    const decision = (result.randomDecisions ?? []).find(
      (entry) => entry.key === 'pet.eagle-faint-summon',
    );

    expect(decision?.options.map((option) => option.id)).toEqual([
      'Manticore',
      'Hydra',
    ]);
    expect(['Manticore', 'Hydra']).toContain(decision?.selectedOptionId);
  });

  it('does not fall back to pets outside the pack when the next tier is empty', () => {
    const emptyPoolConfig: SimulationConfig = {
      ...baseConfig,
      customPacks: [
        {
          ...baseConfig.customPacks![0],
          tier6Pets: [],
        },
      ],
    };

    const result = runSimulation(emptyPoolConfig);
    const decisions = result.randomDecisions ?? [];
    const logs = result.battles?.[0]?.logs ?? [];

    expect(
      decisions.some((entry) => entry.key === 'pet.eagle-faint-summon'),
    ).toBe(false);
    expect(
      logs.some((entry) => entry.message?.includes('Eagle spawned')),
    ).toBe(false);
  });
});
