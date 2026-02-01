import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../simulation/simulate';

describe('Minotaur FriendAheadAttacked', () => {
  const baseConfig: SimulationConfig = {
    playerPack: 'Unicorn',
    opponentPack: 'Unicorn',
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

  it('triggers when the friend ahead attacks', () => {
    const config: SimulationConfig = {
      ...baseConfig,
      playerPets: [
        {
          name: 'Ant',
          attack: 2,
          health: 2,
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
          name: 'Minotaur',
          attack: 3,
          health: 3,
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
          attack: 2,
          health: 2,
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
    const minotaurLog = logs.find((log: any) =>
      log.type === 'ability' &&
      typeof log.message === 'string' &&
      log.message.includes('Minotaur gave Minotaur 1 attack and 1 health.')
    );

    expect(minotaurLog).toBeDefined();
  });
});
