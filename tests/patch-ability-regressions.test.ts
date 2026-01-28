import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../simulation/simulate';

describe('Pet Ability Patch Regressions', () => {
    const baseConfig: SimulationConfig = {
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
        playerPets: [null, null, null, null, null],
        opponentPets: [null, null, null, null, null],
    };

    it('Tadpole should transform into a Frog upon fainted (ThisDied trigger)', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Tadpole',
                    attack: 1,
                    health: 1,
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
            opponentPets: [
                {
                    name: 'Elephant',
                    attack: 10,
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
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const transformLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Tadpole transformed into a level 1 Frog')
        );

        expect(transformLog).toBeDefined();
    });

    it('Roadrunner should give Strawberry and +2 attack at StartBattle', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Ant',
                    attack: 2,
                    health: 1,
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
                    name: 'Roadrunner',
                    attack: 4,
                    health: 1,
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
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const roadrunnerLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Roadrunner gave Strawberry and +2 attack to Ant')
        );

        expect(roadrunnerLog).toBeDefined();
    });

    it('Cocoa Bean should transform pet into random enemy before attack', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: { name: 'Cocoa Bean' },
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
                    name: 'Elephant',
                    attack: 10,
                    health: 10,
                    exp: 0,
                    equipment: { name: 'Garlic' },
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
        const cocoaBeanLog = logs.find((log: any) =>
            log.type === 'equipment' &&
            typeof log.message === 'string' &&
            log.message.includes('transformed into Elephant (Cocoa Bean)')
        );

        expect(cocoaBeanLog).toBeDefined();
    });
});
