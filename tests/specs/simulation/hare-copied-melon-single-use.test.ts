import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';
import type { Log } from 'app/domain/interfaces/log.interface';

describe('Hare copied Melon consumption', () => {
  it('consumes copied Melon only once', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Puppy',
      turn: 1,
      simulationCount: 1,
      logsEnabled: true,
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
          name: 'Brain Cramp',
          attack: 10,
          health: 30,
          exp: 0,
          mana: 0,
          equipment: { name: 'Melon' },
          belugaSwallowedPet: null,
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
          name: 'Hare',
          attack: 7,
          health: 25,
          exp: 0,
          mana: 0,
          equipment: { name: 'Rice' },
          belugaSwallowedPet: null,
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

    const melonBlockedBrainCrampHits = logs.filter((log: Log) => {
      const message = String(log?.message ?? '');
      return (
        message.includes('Brain Cramp attacks Hare for 0.') &&
        message.includes('(Melon -20)')
      );
    });

    expect(melonBlockedBrainCrampHits.length).toBe(1);
  });

  it('can copy Coconut from an enemy', () => {
    const config = createHareCopyConfig('Coconut');

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];

    expect(hasLogMessage(logs, 'Hare copied Coconut to Hare')).toBe(true);
    expect(
      hasLogMessage(logs, 'Brain Cramp attacks Hare for 0. (Coconut block)'),
    ).toBe(true);
  });

  it('can copy Peanut from an enemy', () => {
    const config = createHareCopyConfig('Peanut');

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];

    expect(hasLogMessage(logs, 'Hare copied Peanut to Hare')).toBe(true);
    expect(hasLogMessage(logs, 'Hare attacks Brain Cramp for 7. (Peanut)')).toBe(
      true,
    );
  });
});

function createHareCopyConfig(equipmentName: string): SimulationConfig {
  return {
    playerPack: 'Unicorn',
    opponentPack: 'Puppy',
    turn: 1,
    simulationCount: 1,
    logsEnabled: true,
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
        name: 'Brain Cramp',
        attack: 10,
        health: 30,
        exp: 0,
        mana: 0,
        equipment: { name: equipmentName },
        belugaSwallowedPet: null,
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
        name: 'Hare',
        attack: 7,
        health: 25,
        exp: 0,
        mana: 0,
        equipment: { name: 'Rice' },
        belugaSwallowedPet: null,
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
}

function hasLogMessage(logs: Log[], expected: string): boolean {
  return logs.some((log) => String(log.message ?? '').includes(expected));
}
