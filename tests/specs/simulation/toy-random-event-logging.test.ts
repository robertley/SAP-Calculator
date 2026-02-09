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

function createPet(name: string, attack = 4, health = 4) {
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

describe('Toy random-event logging', () => {
  it('does not mark Evil Book empty-front trigger as random when only one toy event exists', () => {
    const config = createBaseConfig();
    config.playerToy = 'Evil Book';
    config.playerToyLevel = 1;
    // Leave front slot empty so EmptyFrontSpace toy event triggers.
    config.playerPets[1] = createPet('Ant');
    config.opponentPets[0] = createPet('Fish');

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const toyLog = logs.find(
      (log: any) =>
        typeof log?.message === 'string' &&
        log.message.includes('Evil Book triggered after empty front space'),
    ) as any;

    expect(toyLog).toBeDefined();
    expect(Boolean(toyLog?.randomEvent)).toBe(false);
    expect(toyLog?.randomEventReason).toBe('deterministic');
  });

  it('does not mark start-of-battle toy activation as random when toy priorities differ', () => {
    const config = createBaseConfig();
    config.playerToy = 'Air Palm Tree';
    config.playerToyLevel = 1;
    config.opponentToy = 'Camera';
    config.opponentToyLevel = 1;
    config.playerPets[0] = createPet('Ant');
    config.opponentPets[0] = createPet('Fish');

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const activationLogs = logs.filter(
      (log: any) =>
        typeof log?.message === 'string' &&
        log.message.includes('activated at start of battle'),
    ) as any[];

    expect(activationLogs.length).toBeGreaterThanOrEqual(2);
    for (const log of activationLogs) {
      expect(Boolean(log?.randomEvent)).toBe(false);
      expect(log?.randomEventReason).toBe('deterministic');
    }
  });

  it('marks start-of-battle toy activation as random when toy priorities tie', () => {
    const config = createBaseConfig();
    config.playerToy = 'Action Figure';
    config.playerToyLevel = 1;
    config.opponentToy = 'Chocolate Box';
    config.opponentToyLevel = 1;
    config.playerPets[0] = createPet('Ant');
    config.opponentPets[0] = createPet('Fish');

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const activationLogs = logs.filter(
      (log: any) =>
        typeof log?.message === 'string' &&
        log.message.includes('activated at start of battle'),
    ) as any[];

    expect(activationLogs.length).toBeGreaterThanOrEqual(2);
    for (const log of activationLogs) {
      expect(Boolean(log?.randomEvent)).toBe(true);
      expect(log?.randomEventReason).toBe('tie-broken');
    }
  });

  it('marks non-order random events as true-random', () => {
    const config = createBaseConfig();
    config.playerPets[0] = createPet('Ant', 2, 1);
    config.playerPets[1] = createPet('Fish', 3, 3);
    config.playerPets[2] = createPet('Otter', 3, 3);
    config.opponentPets[0] = createPet('Fish', 10, 10);

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const randomLog = logs.find(
      (log: any) =>
        log?.randomEvent === true &&
        typeof log?.message === 'string' &&
        !log.message.includes('activated at start of battle'),
    ) as any;

    expect(randomLog).toBeDefined();
    expect(randomLog?.randomEventReason).toBe('true-random');
  });
});

