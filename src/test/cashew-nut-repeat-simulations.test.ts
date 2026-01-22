import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../../simulation/simulate';

describe('Cashew Nut repeat simulations', () => {
  it('triggers start-of-battle snipe in each simulation', () => {
    const config: SimulationConfig = {
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      turn: 5,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      playerPets: [
        {
          name: 'Ant',
          attack: 1,
          health: 10,
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
          name: 'Fish',
          attack: 1,
          health: 10,
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
          name: 'Mouse',
          attack: 2,
          health: 5,
          exp: 0,
          equipment: { name: 'Cashew Nut' },
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
      ],
      opponentPets: [
        {
          name: 'Beaver',
          attack: 2,
          health: 8,
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
      simulationCount: 2,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: false,
      playerRollAmount: 4,
      opponentRollAmount: 4,
      playerSummonedAmount: 0,
      opponentSummonedAmount: 0,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 0,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
    };

    const result = runSimulation(config);

    expect(result.battles?.length).toBe(2);

    const hasCashewSnipe = (battleIndex: number) => {
      const logs = result.battles?.[battleIndex]?.logs ?? [];
      return logs.some(
        (log) =>
          log.type === 'attack' &&
          typeof log.message === 'string' &&
          log.message.includes('sniped') &&
          log.message.includes('(Cashew Nut)'),
      );
    };

    expect(hasCashewSnipe(0)).toBe(true);
    expect(hasCashewSnipe(1)).toBe(true);
  });
});
