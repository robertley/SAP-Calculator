import { describe, expect, it } from 'vitest';
import {
  runReplayPositioningFromCalculatorState,
  runReplayStrengthFromCalculatorState,
} from '../../../simulation/simulate';
import type { ReplayCalculatorState } from '../../../src/app/integrations/replay/replay-calc-parser';

function emptyReplayState(): ReplayCalculatorState {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    playerToy: null,
    playerToyLevel: '1',
    playerHardToy: null,
    playerHardToyLevel: 1,
    opponentToy: null,
    opponentToyLevel: '1',
    opponentHardToy: null,
    opponentHardToyLevel: 1,
    turn: 1,
    playerGoldSpent: 0,
    opponentGoldSpent: 0,
    playerRollAmount: 0,
    opponentRollAmount: 0,
    playerSummonedAmount: 0,
    opponentSummonedAmount: 0,
    playerLevel3Sold: 0,
    opponentLevel3Sold: 0,
    playerTransformationAmount: 0,
    opponentTransformationAmount: 0,
    playerPets: [],
    opponentPets: [],
    allPets: false,
    logFilter: null,
    customPacks: [],
    oldStork: false,
    tokenPets: false,
    komodoShuffle: false,
    mana: false,
    seed: 123,
    triggersConsumed: false,
    showAdvanced: false,
    showTriggerNamesInLogs: false,
    showPositionalArgsInLogs: false,
    ailmentEquipment: false,
  };
}

describe('headless replay analysis', () => {
  it('returns independently simulated baseline and optimized positioning', () => {
    const result = runReplayPositioningFromCalculatorState(emptyReplayState(), {
      side: 'player',
      precision: 'quick',
      simulationCount: 2,
      projectEndTurnEffects: false,
    });

    expect(result.simulationCount).toBe(2);
    expect(result.optimization.bestPermutation.order).toEqual([]);
    expect(result.baseline.draws).toBe(2);
    expect(result.optimized.draws).toBe(2);
  });

  it('evaluates both sides with the requested BS1 precision', () => {
    const result = runReplayStrengthFromCalculatorState(
      emptyReplayState(),
      'quick',
      { minStat: 1, maxStat: 1 },
    );

    expect(result.precision).toBe('quick');
    expect(result.player.side).toBe('player');
    expect(result.opponent.side).toBe('opponent');
    expect(result.player.version).toBe('BS1');
    expect(result.player.totalBattles).toBeGreaterThan(0);
    expect(result.opponent.totalBattles).toBeGreaterThan(0);
  });
});
