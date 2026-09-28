import { describe, expect, it } from 'vitest';
import type { FightOptimizerResult, PetConfig } from 'sap-battle-engine';
import {
  getFightOptimizerDisplayLineup,
  getFightOptimizerLineup,
  getFightOptimizerStepChanges,
  getFightOptimizerTraceSteps,
} from 'app/ui/components/fight-optimizer-report/fight-optimizer-report-lineups';

const ant: PetConfig = { name: 'Ant', attack: 2, health: 1 };
const fish: PetConfig = {
  name: 'Fish',
  attack: 3,
  health: 4,
  equipment: 'Garlic',
};
const dog: PetConfig = { name: 'Dog', attack: 4, health: 2 };
const cat: PetConfig = { name: 'Cat', attack: 3, health: 3 };

const matchup = {
  playerPosition: 1,
  opponentPosition: 0,
  simulations: 10,
  playerWins: 5,
  opponentWins: 3,
  draws: 2,
  playerWinPercent: 50,
  opponentWinPercent: 30,
  drawPercent: 20,
  sampledOutcome: null,
};

function makeResult(): FightOptimizerResult {
  return {
    evidence: 'sampled',
    termination: 'cycle',
    positionings: {
      player: [
        { id: 0, order: [0, 1, 2] },
        { id: 1, order: [1, 0, 2] },
      ],
      opponent: [
        { id: 0, order: [0, 1] },
        { id: 1, order: [1, 0] },
      ],
    },
    steps: [
      {
        index: 0,
        side: 'player',
        playerPosition: 1,
        opponentPosition: 0,
        matchup,
        bestResponses: [1],
        searchedPositions: 2,
        searchComplete: true,
        refined: false,
      },
      {
        index: 1,
        side: 'opponent',
        playerPosition: 1,
        opponentPosition: 1,
        matchup: { ...matchup, opponentPosition: 1 },
        bestResponses: [1],
        searchedPositions: 2,
        searchComplete: true,
        refined: false,
      },
    ],
    finalPosition: {
      playerOrder: [1, 0, 2],
      playerPets: [fish, ant, null],
      opponentOrder: [1, 0],
      opponentPets: [cat, dog],
    },
    matchups: [],
    stats: {
      simulations: 0,
      evaluatedMatchups: 0,
      potentialMatchups: 2,
      cacheHits: 0,
      engineCalls: 0,
      seed: 1,
      elapsedMs: 0,
    },
  };
}

describe('fight optimizer report lineups', () => {
  it('mirrors the player lineup while retaining logical engine positions', () => {
    expect(
      getFightOptimizerDisplayLineup([ant, fish, dog], 'player'),
    ).toEqual([
      { pet: dog, position: 3 },
      { pet: fish, position: 2 },
      { pet: ant, position: 1 },
    ]);
  });

  it('keeps the opponent lineup in engine front-to-back order', () => {
    expect(
      getFightOptimizerDisplayLineup([ant, fish, dog], 'opponent'),
    ).toEqual([
      { pet: ant, position: 1 },
      { pet: fish, position: 2 },
      { pet: dog, position: 3 },
    ]);
  });

  it('shows only the repeating response steps when the result has a cycle', () => {
    const result = makeResult();
    result.steps.push(
      { ...result.steps[0], index: 2 },
      { ...result.steps[1], index: 3 },
      { ...result.steps[0], index: 4 },
      { ...result.steps[1], index: 5 },
      { ...result.steps[0], index: 6 },
    );
    result.cycle = { startState: 3, endState: 7, length: 4 };

    expect(getFightOptimizerTraceSteps(result)).toEqual(
      result.steps.slice(3, 7).map((step, offset) => ({
        step,
        stepIndex: offset + 3,
      })),
    );
  });

  it('shows the complete response trace when no cycle occurs', () => {
    const result = makeResult();
    result.termination = 'no-sampled-counter';
    delete result.cycle;

    expect(getFightOptimizerTraceSteps(result)).toEqual(
      result.steps.map((step, stepIndex) => ({ step, stepIndex })),
    );
  });

  it('reconstructs any response order from the arranged final pets', () => {
    const result = makeResult();

    expect(getFightOptimizerLineup(result, 'player', 0)).toEqual([
      ant,
      fish,
      null,
    ]);
    expect(getFightOptimizerLineup(result, 'player', 1)).toEqual([
      fish,
      ant,
      null,
    ]);
  });

  it('returns no lineup for an unknown position id', () => {
    expect(getFightOptimizerLineup(makeResult(), 'player', 99)).toEqual([]);
  });

  it('describes first-step moves from the initial heuristic order', () => {
    expect(getFightOptimizerStepChanges(makeResult(), 0)).toEqual([
      { pet: fish, fromPosition: 2, toPosition: 1 },
      { pet: ant, fromPosition: 1, toPosition: 2 },
    ]);
  });

  it('describes later moves from the immediately preceding state', () => {
    expect(getFightOptimizerStepChanges(makeResult(), 1)).toEqual([
      { pet: cat, fromPosition: 2, toPosition: 1 },
      { pet: dog, fromPosition: 1, toPosition: 2 },
    ]);
  });
});
