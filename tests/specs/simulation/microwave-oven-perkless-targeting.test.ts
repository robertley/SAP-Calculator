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

function createPet(name: string, attack = 4, health = 4, equipment: any = null) {
  return {
    name,
    attack,
    health,
    exp: 0,
    mana: 0,
    triggersConsumed: 0,
    foodsEaten: 0,
    equipment,
    belugaSwallowedPet: null,
    abominationSwallowedPet1: null,
    abominationSwallowedPet2: null,
    abominationSwallowedPet3: null,
    battlesFought: 0,
    timesHurt: 0,
  };
}

describe('Microwave Oven targeting', () => {
  it('skips pets with perks and gives Popcorn to the next perkless pet behind', () => {
    const config = createBaseConfig();
    config.playerToy = 'Microwave Oven';
    config.playerToyLevel = 1;

    config.playerPets[0] = createPet('Fish', 3, 5, { name: 'Cucumber' });
    config.playerPets[1] = createPet('Ant', 2, 3);
    config.opponentPets[0] = createPet('Pig', 3, 3);

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];

    const microwaveLogs = logs.filter(
      (log: any) =>
        typeof log?.message === 'string' &&
        log.message.includes('Microwave Oven gave'),
    );

    const hitPerkedFrontPet = microwaveLogs.some((log: any) =>
      log.message.includes('gave Fish Popcorn'),
    );
    const hitNextPerklessPet = microwaveLogs.some((log: any) =>
      log.message.includes('gave Ant Popcorn'),
    );

    expect(hitPerkedFrontPet).toBe(false);
    expect(hitNextPerklessPet).toBe(true);
  });
});
