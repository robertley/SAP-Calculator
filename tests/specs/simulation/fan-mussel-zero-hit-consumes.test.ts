import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Fan Mussel zero-hit trigger consumption', () => {
  it('consumes Fan Mussel uses even when incoming attack damage is 0', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Turtle',
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
      playerPets: [
        {
          name: 'Fan Mussel',
          attack: 1,
          health: 10,
          exp: 0,
          equipment: { name: 'White Okra' },
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
      opponentPets: [
        {
          name: 'Ant',
          attack: 1,
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
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const antHitsFanMussel = logs.filter((log: any) =>
      typeof log.message === 'string' &&
      log.message.includes('Ant attacks Fan Mussel for 0.') &&
      log.message.includes('(Fan Mussel)'),
    );

    // Fan Mussel has maxUses=2 at level 1, so only the first two 0-damage hits should consume and log it.
    expect(antHitsFanMussel.length).toBe(2);
  });
});
