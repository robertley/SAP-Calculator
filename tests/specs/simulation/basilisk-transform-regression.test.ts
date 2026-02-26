import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Basilisk transform regression', () => {
  it('keeps initialized stats and transforms friend ahead into a valid Rock', () => {
    const config: SimulationConfig = {
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
          name: 'Basilisk',
          attack: 5,
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
      ],
      opponentPets: [
        {
          name: 'Fish',
          attack: 3,
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

    const basiliskTransformLog = logs.find(
      (log) =>
        log.type === 'ability' &&
        typeof log.message === 'string' &&
        log.message.includes('Basilisk transformed Ant into a Rock with +5 health.'),
    );
    expect(basiliskTransformLog).toBeDefined();

    const boardMessages = logs
      .filter((log) => log.type === 'board' && typeof log.message === 'string')
      .map((log) => String(log.message));
    const boardText = boardMessages.join('\n').replace(/<[^>]+>/g, '');

    expect(boardText).not.toContain('undefined/undefined');
    expect(boardText).toContain('(2/7/0xp)');
  });
});
