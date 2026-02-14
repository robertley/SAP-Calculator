import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

function createBaseConfig(): SimulationConfig {
  return {
    playerPack: 'Custom',
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
    playerPets: [null, null, null, null, null],
    opponentPets: [null, null, null, null, null],
  };
}

function createPet(name: string, attack = 1, health = 1) {
  return {
    name,
    attack,
    health,
    exp: 0,
    mana: 0,
    triggersConsumed: 0,
    foodsEaten: 0,
    equipment: null,
    belugaSwallowedPet: null,
    abominationSwallowedPet1: null,
    abominationSwallowedPet2: null,
    abominationSwallowedPet3: null,
    battlesFought: 0,
    timesHurt: 0,
  };
}

describe('Scale toy cap regression', () => {
  it('caps target stats at pet stat caps on very high turns', () => {
    const config = createBaseConfig();
    config.turn = 1000;
    config.logsEnabled = true;
    config.playerToy = 'Scale';
    config.playerToyLevel = 1;

    config.playerPets[0] = createPet('Ant', 1, 1);
    config.playerPets[1] = createPet('Behemoth', 1, 1);
    config.playerPets[2] = {
      ...createPet('Abomination', 1, 1),
      abominationSwallowedPet1: 'Behemoth',
      abominationSwallowedPet2: 'Ant',
      abominationSwallowedPet3: 'Fish',
    };
    config.playerPets[3] = createPet('Giant Tortoise', 1, 1);
    config.opponentPets[0] = createPet('Fish', 1, 1);

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];

    const scaleLogs = logs.filter(
      (log: any) =>
        typeof log?.message === 'string' &&
        log.message.startsWith('Scale set '),
    );

    expect(scaleLogs.some((log: any) => log.message === 'Scale set Ant to 50/50.')).toBe(true);
    expect(scaleLogs.some((log: any) => log.message === 'Scale set Behemoth to 100/100.')).toBe(true);
    expect(scaleLogs.some((log: any) => log.message === 'Scale set Abomination to 100/100.')).toBe(true);
    expect(scaleLogs.some((log: any) => log.message === 'Scale set Giant Tortoise to 50/100.')).toBe(true);
    expect(scaleLogs.some((log: any) => log.message.includes('1000/1000'))).toBe(false);
  });
});
