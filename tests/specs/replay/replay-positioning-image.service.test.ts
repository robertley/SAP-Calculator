import { describe, expect, it, vi } from 'vitest';
import type { PetConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';
import { getPetIconPath, getToyIconPath } from '../../../src/app/runtime/asset-catalog';
import { UrlStateService } from '../../../src/app/runtime/state/url-state.service';
import {
  ReplayBattleJson,
  ReplayCalcParser,
  ReplayCalculatorState,
} from '../../../src/app/integrations/replay/replay-calc-parser';
import {
  buildOptimizedPositioningCalculatorState,
  ReplayPositioningImageService,
} from '../../../src/app/integrations/replay/replay-positioning-image.service';
import type { PositioningOptimizationResult } from '../../../src/app/integrations/simulation/positioning-optimizer';
import { mergeReplayImageCalculatorState } from '../../../src/app/integrations/replay/replay-image-calculator-state';

function pet(name: string, attack: number): PetConfig {
  return { name, attack, health: attack + 1, exp: 1, equipment: null };
}

function calculatorState(): ReplayCalculatorState {
  const state = new ReplayCalcParser().parseReplayForCalculator({
    UserBoard: { Pack: 'Turtle', Mins: { Items: [] } },
    OpponentBoard: { Pack: 'Turtle', Mins: { Items: [] } },
  });
  return {
    ...state,
    playerToy: 'Action Figure',
    playerToyLevel: 2,
    opponentToy: 'Microwave Oven',
    opponentToyLevel: 3,
    playerPets: [pet('Ant', 1), pet('Fish', 2), null, null, null],
    opponentPets: [pet('Otter', 3), null, null, null, null],
  };
}

function optimizationResult(lineup: (PetConfig | null)[]): PositioningOptimizationResult {
  const permutation = {
    order: [1, 0, 2, 3, 4],
    lineup,
    simulationLineup: lineup,
    simulations: 100,
    wins: 60,
    draws: 10,
    losses: 30,
    score: 0.65,
    lowerBound: 0.5,
    upperBound: 0.8,
    eliminated: false,
  };
  return {
    side: 'player',
    totalPermutations: 2,
    prunedPermutations: 0,
    simulatedBattles: 200,
    aborted: false,
    bestPermutation: permutation,
    rankedPermutations: [permutation],
  };
}

describe('positioning image row state', () => {
  it('uses one optimized state for the link while retaining both toys', () => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://sap-calculator.com',
        pathname: '/',
        search: '',
        hash: '',
      },
    });
    const initial = calculatorState();
    const optimizedLineup = [
      pet('Fish', 12),
      pet('Ant', 11),
      null,
      null,
      null,
    ];
    const optimized = buildOptimizedPositioningCalculatorState(
      initial,
      optimizationResult(optimizedLineup),
    );

    expect(optimized.playerPets.map((entry) => entry?.name ?? null)).toEqual([
      'Fish',
      'Ant',
      null,
      null,
      null,
    ]);
    expect(optimized.playerPets[0]?.attack).toBe(12);
    expect(initial.playerPets[0]?.name).toBe('Ant');
    expect(optimized.opponentPets).toEqual(initial.opponentPets);

    const link = new ReplayCalcParser().generateCalculatorLink(optimized);
    const url = new URL(link);
    vi.stubGlobal('window', {
      location: { search: url.search, hash: url.hash },
    });
    const decoded = new UrlStateService().parseCalculatorStateFromUrl().state;

    expect((decoded?.['playerPets'] as unknown[]).slice(0, 2)).toMatchObject([
      { name: 'Fish', attack: 12 },
      { name: 'Ant', attack: 11 },
    ]);
    expect(decoded).toMatchObject({
      playerToy: 'Action Figure',
      playerToyLevel: 2,
      opponentToy: 'Microwave Oven',
      opponentToyLevel: 3,
    });
    vi.unstubAllGlobals();
  });

  it('uses that same optimized state for canvas order and both toy images', () => {
    const service = new ReplayPositioningImageService(
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
    );
    const initial = calculatorState();
    const optimized = buildOptimizedPositioningCalculatorState(
      initial,
      optimizationResult([
        pet('Fish', 12),
        pet('Ant', 11),
        null,
        null,
        null,
      ]),
    );
    const render = (
      service as unknown as {
        toRenderBattleInfo: (
          battle: ReplayBattleJson,
          state: ReplayCalculatorState,
        ) => {
          playerPets: Array<{ imagePath: string | null } | null>;
          playerToy: { imagePath: string | null; level: number } | null;
          opponentToy: { imagePath: string | null; level: number } | null;
        };
      }
    ).toRenderBattleInfo({}, optimized);

    expect(render.playerPets.map((entry) => entry?.imagePath ?? null)).toEqual([
      getPetIconPath('Fish'),
      getPetIconPath('Ant'),
      null,
      null,
      null,
    ]);
    expect(render.playerToy).toEqual({
      imagePath: getToyIconPath('Action Figure'),
      level: 2,
    });
    expect(render.opponentToy).toEqual({
      imagePath: getToyIconPath('Microwave Oven'),
      level: 3,
    });
  });

  it('merges sparse calculator API state over parsed replay defaults', () => {
    const merged = mergeReplayImageCalculatorState(calculatorState(), {
      playerToy: 'Microwave Oven',
      playerPets: [{ name: 'Fish', attack: 9 }, null],
    });

    expect(merged.playerPack).toBe('Turtle');
    expect(merged.playerToy).toBe('Microwave Oven');
    expect(merged.opponentToy).toBe('Microwave Oven');
    expect(merged.playerPets[0]).toMatchObject({
      name: 'Fish',
      attack: 9,
      health: 0,
      exp: 0,
      equipment: null,
    });
  });

});
