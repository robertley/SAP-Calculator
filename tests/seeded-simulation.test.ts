import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../simulation/simulate';

function createSeedConfig(seed: number): SimulationConfig {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    turn: 1,
    simulationCount: 50,
    seed,
    oldStork: false,
    tokenPets: false,
    komodoShuffle: false,
    mana: false,
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
    playerPets: [
      {
        name: 'Ant',
        attack: 2,
        health: 1,
        exp: 0,
        equipment: null,
      },
      {
        name: 'Fish',
        attack: 2,
        health: 2,
        exp: 0,
        equipment: null,
      },
      {
        name: 'Otter',
        attack: 2,
        health: 2,
        exp: 0,
        equipment: null,
      },
      null,
      null,
    ],
    opponentPets: [
      {
        name: 'Fish',
        attack: 2,
        health: 2,
        exp: 0,
        equipment: null,
      },
      {
        name: 'Beaver',
        attack: 2,
        health: 2,
        exp: 0,
        equipment: null,
      },
      {
        name: 'Pig',
        attack: 2,
        health: 2,
        exp: 0,
        equipment: null,
      },
      null,
      null,
    ],
  };
}

function summarize(result: ReturnType<typeof runSimulation>) {
  const firstBattleLogs = (result.battles?.[0]?.logs ?? []).map((log: any) => ({
    message: log?.message,
    randomEvent: Boolean(log?.randomEvent),
    randomEventReason: log?.randomEventReason ?? null,
  }));
  return {
    playerWins: result.playerWins,
    opponentWins: result.opponentWins,
    draws: result.draws,
    firstBattleLogs,
  };
}

describe('Simulation seed mode', () => {
  it('replays the same outcomes with the same seed', () => {
    const config = createSeedConfig(1337);
    const first = summarize(runSimulation(config));
    const second = summarize(runSimulation(config));

    expect(first).toEqual(second);
  });
});

