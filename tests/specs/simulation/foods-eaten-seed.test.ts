import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Foods Eaten seed values', () => {
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

  it('Black Bear uses foods eaten from shop on faint', () => {
    const config: SimulationConfig = {
      ...baseConfig,
      playerPets: [
        {
          name: 'Black Bear',
          attack: 5,
          health: 1,
          exp: 0,
          equipment: null,
          belugaSwallowedPet: null,
          mana: 0,
          triggersConsumed: 0,
          foodsEaten: 2,
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
      opponentPets: [
        {
          name: 'Fish',
          attack: 6,
          health: 15,
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
    const bearLog = logs.find((log: any) =>
      log.type === 'ability' &&
      typeof log.message === 'string' &&
      log.message.includes('Black Bear dealt 8 damage to Fish after eating 2 food items.')
    );

    expect(bearLog).toBeDefined();
  });

  it('Dung Beetle uses foods eaten from shop on faint', () => {
    const config: SimulationConfig = {
      ...baseConfig,
      playerPets: [
        {
          name: 'Dung Beetle',
          attack: 2,
          health: 1,
          exp: 0,
          equipment: null,
          belugaSwallowedPet: null,
          mana: 0,
          triggersConsumed: 0,
          foodsEaten: 3,
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
      opponentPets: [
        {
          name: 'Fish',
          attack: 10,
          health: 20,
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
    const beetleLog = logs.find((log: any) =>
      log.type === 'ability' &&
      typeof log.message === 'string' &&
      log.message.includes('Dung Beetle dealt 3 damage 3 time(s) to the weakest enemy.')
    );

    expect(beetleLog).toBeDefined();
  });
});

