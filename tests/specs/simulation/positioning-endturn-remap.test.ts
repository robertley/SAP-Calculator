import { describe, expect, it } from 'vitest';
import {
  runPositioningOptimization,
  PositioningOptimizationSide,
} from 'app/integrations/simulation/positioning-optimizer';
import {
  PetConfig,
  SimulationConfig,
} from '../../../src/app/domain/interfaces/simulation-config.interface';

function clonePet(pet: PetConfig | null): PetConfig | null {
  if (!pet) {
    return null;
  }
  return {
    ...pet,
    equipment: pet.equipment ? { ...pet.equipment } : null,
  };
}

function cloneLineup(lineup: (PetConfig | null)[]): (PetConfig | null)[] {
  return lineup.map((pet) => clonePet(pet));
}

function toLevel(pet: PetConfig | null): number {
  const exp = pet?.exp ?? 0;
  if (exp >= 5) {
    return 3;
  }
  if (exp >= 2) {
    return 2;
  }
  return 1;
}

function projectFakeEndTurnLineup(
  baseConfig: SimulationConfig,
  side: PositioningOptimizationSide,
  lineup: (PetConfig | null)[],
): (PetConfig | null)[] {
  const projected = cloneLineup(lineup);

  const firstFrontIndex = projected.findIndex((pet) => Boolean(pet?.name));
  projected.forEach((pet) => {
    if (!pet || pet.name !== 'Monkey' || firstFrontIndex === -1) {
      return;
    }
    const target = projected[firstFrontIndex];
    if (!target) {
      return;
    }
    const power = 2 * toLevel(pet);
    target.attack = (target.attack ?? 0) + power;
    target.health = (target.health ?? 0) + power;
  });

  const lostLastBattle =
    side === 'player'
      ? Boolean(baseConfig.playerLostLastBattle)
      : Boolean(baseConfig.opponentLostLastBattle);
  projected.forEach((pet, index) => {
    if (!pet || pet.name !== 'Snail' || !lostLastBattle) {
      return;
    }
    const power = toLevel(pet);
    for (let targetIndex = index - 1; targetIndex >= 0; targetIndex -= 1) {
      if (!projected[targetIndex]) {
        continue;
      }
      (projected[targetIndex] as PetConfig).attack =
        ((projected[targetIndex] as PetConfig).attack ?? 0) + power;
    }
  });

  return projected;
}

function scoreFromFrontAttack(config: SimulationConfig) {
  const total = config.simulationCount ?? 1;
  const attack = Math.max(0, Math.trunc(config.playerPets[0]?.attack ?? 0));
  const wins = Math.min(total, attack);
  return {
    playerWins: wins,
    opponentWins: 0,
    draws: total - wins,
  };
}

function scoreFromTotalAttack(config: SimulationConfig) {
  const total = config.simulationCount ?? 1;
  const attack = config.playerPets.reduce(
    (sum, pet) => sum + Math.max(0, Math.trunc(pet?.attack ?? 0)),
    0,
  );
  const wins = Math.min(total, attack);
  return {
    playerWins: wins,
    opponentWins: 0,
    draws: total - wins,
  };
}

function baseConfig(playerPets: (PetConfig | null)[]): SimulationConfig {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    turn: 9,
    simulationCount: 20,
    playerPets,
    opponentPets: [null, null, null, null, null],
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
    logsEnabled: false,
    maxLoggedBattles: 0,
    oldStork: false,
    tokenPets: false,
    komodoShuffle: false,
    mana: false,
  };
}

describe('positioning optimizer end-turn remap', () => {
  it('reassigns Monkey front buff when permutation changes', () => {
    const config = baseConfig([
      { name: 'Fish', attack: 5, health: 7, exp: 1, equipment: null },
      { name: 'Monkey', attack: 1, health: 2, exp: 1, equipment: null },
      { name: 'Ant', attack: 4, health: 4, exp: 1, equipment: null },
    ]);

    const result = runPositioningOptimization({
      baseConfig: config,
      options: {
        side: 'player',
        maxSimulationsPerPermutation: 20,
        batchSize: 20,
        minSamplesBeforeElimination: 20,
      },
      projectEndTurnLineup: ({ baseConfig: cfg, side, lineup }) =>
        projectFakeEndTurnLineup(cfg, side, lineup),
      simulateBatch: (batchConfig) => scoreFromFrontAttack(batchConfig),
    });

    expect(result.bestPermutation.lineup[0]?.name).toBe('Ant');
  });

  it('reassigns Snail attack buffs across the new nearest-ahead friends', () => {
    const config = {
      ...baseConfig([
        { name: 'Fish', attack: 4, health: 4, exp: 1, equipment: null },
        { name: 'Otter', attack: 4, health: 4, exp: 1, equipment: null },
        { name: 'Snail', attack: 2, health: 2, exp: 1, equipment: null },
        { name: 'Ant', attack: 3, health: 3, exp: 1, equipment: null },
      ]),
      playerLostLastBattle: true,
    };

    const result = runPositioningOptimization({
      baseConfig: config,
      options: {
        side: 'player',
        maxSimulationsPerPermutation: 20,
        batchSize: 20,
        minSamplesBeforeElimination: 20,
      },
      projectEndTurnLineup: ({ baseConfig: cfg, side, lineup }) =>
        projectFakeEndTurnLineup(cfg, side, lineup),
      simulateBatch: (batchConfig) => scoreFromTotalAttack(batchConfig),
    });

    expect(result.bestPermutation.lineup[3]?.name).toBe('Snail');
  });
});
