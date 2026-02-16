import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Sunfish odd-turn snipe with Coconut', () => {
  it('pops Coconut when Sunfish snipes on odd turns', () => {
    const config: SimulationConfig = {
      playerPack: 'Custom',
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
          name: 'Sunfish',
          attack: 4,
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
      opponentPets: [
        {
          name: 'Ant',
          attack: 1,
          health: 10,
          exp: 0,
          mana: 0,
          equipment: { name: 'Coconut' },
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

    const coconutBlockedSunfishSnipe = logs.some(
      (log: any) =>
        typeof log.message === 'string' &&
        log.message.includes('Sunfish sniped Ant for 0.') &&
        log.message.includes('(Coconut block)'),
    );

    expect(coconutBlockedSunfishSnipe).toBe(true);
  });
});
