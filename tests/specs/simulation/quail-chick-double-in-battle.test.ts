import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Quail Chick double stats in battle', () => {
  const baseConfig: SimulationConfig = {
    playerPack: 'Custom',
    opponentPack: 'Custom',
    turn: 1,
    playerGoldSpent: 0,
    opponentGoldSpent: 0,
    simulationCount: 1,
    oldStork: false,
    tokenPets: false,
    komodoShuffle: false,
    mana: true,
    playerRollAmount: 0,
    opponentRollAmount: 0,
    playerLevel3Sold: 0,
    opponentLevel3Sold: 0,
    playerSummonedAmount: 0,
    opponentSummonedAmount: 0,
    playerTransformationAmount: 0,
    opponentTransformationAmount: 0,
    playerPets: [null, null, null, null, null],
    opponentPets: [null, null, null, null, null],
  };

  it('gives doubled stats on FoodEatenByThis', () => {
    const config: SimulationConfig = {
      ...baseConfig,
      playerPets: [
        {
          name: 'Pony',
          attack: 4,
          health: 4,
          exp: 0,
          equipment: null,
          belugaSwallowedPet: null,
          mana: 0,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
        },
        {
          name: 'Quail Chick',
          attack: 2,
          health: 4,
          exp: 0,
          equipment: null,
          belugaSwallowedPet: null,
          mana: 0,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
        },
        null,
        null,
        null,
      ],
      opponentPets: [
        {
          name: 'Fish',
          attack: 1,
          health: 1,
          exp: 0,
          equipment: null,
          belugaSwallowedPet: null,
          mana: 0,
          triggersConsumed: 0,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
        },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const quailLog = logs.find((log: any) =>
      log.type === 'ability' &&
      typeof log.message === 'string' &&
      log.message.includes('Quail Chick transformed into Quail and gave Pony +4 attack and +4 health.')
    );

    expect(quailLog).toBeDefined();
  });
});

