import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Kitsune front mana transfer', () => {
  it('drains mana from the fainted friend and transfers it with bonus to the nearest friend ahead', () => {
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
          name: 'Ant',
          attack: 1,
          health: 1,
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
        {
          name: 'Chimera',
          attack: 2,
          health: 20,
          exp: 0,
          mana: 5,
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
        null,
        null,
      ],
      opponentPets: [
        {
          name: 'Fish',
          attack: 10,
          health: 10,
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

    const tookFromFaintedFriend = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Kitsune took 6 mana from Ant.'),
    );

    const tookFromTarget = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Kitsune took 5 mana from Chimera.'),
    );

    const gaveWithBonus = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Kitsune gave Chimera +8 mana.'),
    );

    expect(tookFromFaintedFriend).toBe(true);
    expect(tookFromTarget).toBe(false);
    expect(gaveWithBonus).toBe(true);
  });
});
