import { describe, expect, it } from 'vitest';
import { runSimulation, type SimulationConfig } from '../../../simulation/simulate';
import type { PetConfig } from 'app/domain/interfaces/simulation-config.interface';

function pet(name: string): PetConfig {
  return {
    name,
    attack: 10,
    health: 50,
    exp: 0,
    mana: 0,
    equipment: null,
  };
}

describe('Roc deterministic mana targeting', () => {
  it('gives mana to friends ahead from back to front without random targeting', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 7,
      simulationCount: 1,
      logsEnabled: true,
      mana: true,
      playerGoldSpent: 0,
      opponentGoldSpent: 0,
      playerRollAmount: 0,
      opponentRollAmount: 0,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
      playerSummonedAmount: 0,
      opponentSummonedAmount: 0,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 0,
      playerPets: [pet('Ant'), pet('Fish'), pet('Roc'), null, null],
      opponentPets: [pet('Pig'), null, null, null, null],
      captureRandomDecisions: true,
      maxLoggedBattles: 1,
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const rocManaLogs = logs
      .map((log) => log.message)
      .filter((message) => message.includes('Roc gave'));

    expect(rocManaLogs).toEqual([
      expect.stringContaining('Roc gave Fish 2 mana.'),
      expect.stringContaining('Roc gave Ant 2 mana.'),
      expect.stringContaining('Roc gave Fish 2 mana.'),
    ]);
    expect(
      result.randomDecisions?.some((decision) =>
        decision.label.includes('Roc -> Random pet target'),
      ) ?? false,
    ).toBe(false);
  });
});
