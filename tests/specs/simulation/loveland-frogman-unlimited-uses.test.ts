import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Loveland Frogman once per pet', () => {
  it('buffs the same attacking friend only once', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Unicorn',
      turn: 1,
      simulationCount: 1,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
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
      playerPets: [
        {
          name: 'Fish',
          attack: 1,
          health: 40,
          exp: 0,
          mana: 0,
          equipment: null,
          triggersConsumed: 0,
          belugaSwallowedPet: null,
          abominationSwallowedPet1: null,
          abominationSwallowedPet2: null,
          abominationSwallowedPet3: null,
          battlesFought: 0,
          timesHurt: 0,
        },
        {
          name: 'Loveland Frogman',
          attack: 1,
          health: 5,
          exp: 0,
          mana: 0,
          equipment: null,
          triggersConsumed: 0,
          belugaSwallowedPet: null,
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
          health: 40,
          exp: 0,
          mana: 0,
          equipment: null,
          triggersConsumed: 0,
          belugaSwallowedPet: null,
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

    const frogmanBuffLogs = logs.filter(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Loveland Frogman gave Fish 1 attack and 2 health.'),
    );

    expect(frogmanBuffLogs.length).toBe(1);
  });
});
