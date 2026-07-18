import { describe, expect, it } from 'vitest';
import {
  SimulationConfig,
  SimulationResult,
} from '../../../src/app/domain/interfaces/simulation-config.interface';
import { runPositioningOptimization } from '../../../src/app/integrations/simulation/positioning-optimizer';

function simulationResult(
  playerWins: number,
  opponentWins: number,
): SimulationResult {
  return { playerWins, opponentWins, draws: 0, battles: [] };
}

describe('positioning optimizer successive halving', () => {
  it('screens a five-pet board with substantially less than the full budget', () => {
    const baseConfig: SimulationConfig = {
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      playerToy: null,
      opponentToy: null,
      turn: 10,
      playerPets: [1, 2, 3, 4, 5].map((attack) => ({
        name: `Pet ${attack}`,
        attack,
        health: attack,
        exp: 1,
        equipment: null,
      })),
      opponentPets: [],
      simulationCount: 100,
      logsEnabled: false,
    };

    const result = runPositioningOptimization({
      baseConfig,
      options: {
        side: 'player',
        maxSimulationsPerPermutation: 100,
        batchSize: 10,
        minSamplesBeforeElimination: 10,
        successiveHalving: true,
        successiveHalvingRate: 0.5,
      },
      simulateBatch: (config) => {
        const count = config.simulationCount ?? 0;
        const frontAttack = config.playerPets[0]?.attack ?? 0;
        return frontAttack === 5
          ? simulationResult(count, 0)
          : simulationResult(0, count);
      },
    });

    expect(result.totalPermutations).toBe(120);
    expect(result.bestPermutation.lineup[0]?.attack).toBe(5);
    expect(result.simulatedBattles).toBeLessThanOrEqual(2400);
    expect(result.simulatedBattles).toBeLessThan(120 * 50);
  });
});
