import { describe, expect, it } from 'vitest';
import { SimulationConfig } from 'app/domain/interfaces/simulation-config.interface';
import {
  buildOutFinderActions,
  getOutFinderCatalog,
  runOutFinder,
} from '../../../src/app/integrations/simulation/out-finder';

function config(playerPets: SimulationConfig['playerPets']): SimulationConfig {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    turn: 1,
    playerPets,
    opponentPets: [null, null, null, null, null],
    simulationCount: 10,
  };
}

describe('Out Finder', () => {
  it('uses every rollable pet and food in the selected pack', () => {
    const catalog = getOutFinderCatalog(config([]), 'player');

    expect(catalog.pack).toBe('Turtle');
    expect(catalog.pets.length).toBeGreaterThan(0);
    expect(catalog.foods.length).toBeGreaterThan(0);
    expect(catalog.pets.every((pet) => pet.exp === 0 && pet.equipment === null)).toBe(true);
  });

  it('limits the catalog to the chosen shop tier', () => {
    const tierOne = getOutFinderCatalog(config([]), 'player', 1);
    const tierSix = getOutFinderCatalog(config([]), 'player', 6);

    expect(tierOne.pets.length).toBeLessThanOrEqual(tierSix.pets.length);
    expect(tierOne.foods.length).toBeLessThanOrEqual(tierSix.foods.length);
    expect(tierOne.pets.length + tierOne.foods.length).toBeGreaterThan(0);
  });

  it('tries every insertion position while preserving the existing relative order', () => {
    const base = config([
      { name: 'Ant', attack: 2, health: 1 },
      { name: 'Fish', attack: 2, health: 3 },
      null,
      null,
      null,
    ]);
    const actions = buildOutFinderActions(base, 'player');
    const petName = getOutFinderCatalog(base, 'player').pets.find(
      (pet) => pet.name !== 'Ant' && pet.name !== 'Fish',
    )?.name;
    expect(petName).toBeTruthy();
    const petActions = actions.filter((action) => action.type === 'pet' && action.name === petName);

    expect(petActions).toHaveLength(3);
    for (const action of petActions) {
      const survivorNames = action.lineup
        .filter((pet) => pet?.name !== petName)
        .map((pet) => pet?.name)
        .filter(Boolean);
      expect(survivorNames).toEqual(['Ant', 'Fish']);
    }
  });

  it('expands random-target food into every legal lucky outcome', () => {
    const base = config([
      { name: 'Ant', attack: 2, health: 1 },
      { name: 'Fish', attack: 2, health: 3 },
      { name: 'Horse', attack: 2, health: 1 },
      null,
      null,
    ]);
    const pizzaActions = buildOutFinderActions(base, 'player', 6).filter(
      (action) => action.type === 'food' && action.name === 'Pizza',
    );

    expect(pizzaActions).toHaveLength(3);
    expect(pizzaActions.map((action) => action.outcomeDescription)).toEqual([
      'Lucky targets: Pet 1 & Pet 2',
      'Lucky targets: Pet 1 & Pet 3',
      'Lucky targets: Pet 2 & Pet 3',
    ]);
    expect(pizzaActions[0].lineup[0]?.attack).toBe(4);
    expect(pizzaActions[0].lineup[1]?.health).toBe(5);
    expect(pizzaActions[0].lineup[2]?.attack).toBe(2);
  });

  it('screens all actions and fully samples only the finalists', () => {
    const base = config([{ name: 'Ant', attack: 2, health: 1 }, null, null, null, null]);
    const result = runOutFinder({
      baseConfig: base,
      options: {
        side: 'player',
        screeningSimulations: 2,
        maxSimulationsPerCandidate: 5,
        finalistCount: 3,
        batchSize: 2,
      },
      simulateBatch: (batch) => {
        const count = batch.simulationCount ?? 0;
        const firstName = batch.playerPets.find(Boolean)?.name;
        const wins = firstName === 'Ant' ? 0 : count;
        return { playerWins: wins, opponentWins: count - wins, draws: 0 };
      },
    });

    expect(result.baseline.simulations).toBe(5);
    expect(result.candidates.every((candidate) => candidate.simulations >= 2)).toBe(true);
    expect(result.candidates.filter((candidate) => candidate.simulations === 5)).toHaveLength(3);
    expect(result.rankedCandidates[0].winDelta).toBe(1);
  });

  it('stops after the baseline when the current board wins every simulation', () => {
    const result = runOutFinder({
      baseConfig: config([{ name: 'Ant', attack: 2, health: 1 }, null, null, null, null]),
      options: { side: 'player', maxSimulationsPerCandidate: 5 },
      simulateBatch: (batch) => ({
        playerWins: batch.simulationCount ?? 0,
        opponentWins: 0,
        draws: 0,
      }),
    });

    expect(result.stopReason).toBe('baseline-perfect');
    expect(result.simulatedBattles).toBe(5);
    expect(result.candidates).toEqual([]);
    expect(result.rankedCandidates).toEqual([]);
  });

  it('does not return zero-improvement candidates', () => {
    const result = runOutFinder({
      baseConfig: config([{ name: 'Ant', attack: 2, health: 1 }, null, null, null, null]),
      options: { side: 'player', maxSimulationsPerCandidate: 4, screeningSimulations: 2 },
      simulateBatch: (batch) => {
        const count = batch.simulationCount ?? 0;
        return { playerWins: Math.floor(count / 2), opponentWins: count - Math.floor(count / 2), draws: 0 };
      },
    });

    expect(result.stopReason).toBe('completed');
    expect(result.rankedCandidates).toEqual([]);
  });
});
