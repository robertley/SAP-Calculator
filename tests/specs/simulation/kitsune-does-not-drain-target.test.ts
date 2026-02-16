import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Kitsune target mana behavior', () => {
  it('uses direct front pet as recipient and does not drain mana from it', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Custom',
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
          name: 'Barghest',
          attack: 1,
          health: 1,
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
          name: 'Chimera',
          attack: 2,
          health: 10,
          exp: 0,
          mana: 10,
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
          name: 'Kitsune',
          attack: 2,
          health: 7,
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
          name: 'Bunyip',
          attack: 1,
          health: 3,
          exp: 0,
          mana: 6,
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
      ],
      opponentPets: [
        {
          name: 'Behemoth',
          attack: 50,
          health: 50,
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

    const drainedFromTarget = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Kitsune took 10 mana from Chimera.'),
    );

    const drainedFromOtherFriend = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Kitsune took 6 mana from Bunyip.'),
    );

    const gaveToFrontTarget = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Kitsune gave Chimera +8 mana.'),
    );

    expect(drainedFromTarget).toBe(false);
    expect(drainedFromOtherFriend).toBe(true);
    expect(gaveToFrontTarget).toBe(true);
  });
});
