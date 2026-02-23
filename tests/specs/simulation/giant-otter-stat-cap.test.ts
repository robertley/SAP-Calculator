import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

function createBaseConfig(): SimulationConfig {
    return {
        playerPack: 'Danger',
        opponentPack: 'Turtle',
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

function createPet(name: string, attack = 1, health = 1, exp = 0) {
    return {
        name,
        attack,
        health,
        exp,
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

describe('Giant Otter Stat Cap', () => {
    it('only removes stats that it actually gave (respecting stat cap)', () => {
        const config = createBaseConfig();
        config.logsEnabled = true;

        // Giant Otter (Level 1) gives +2/+5
        config.playerPets[0] = createPet('Giant Otter', 4, 3);
        // Ant starts at 49/49. Buff should make it 50/50 (+1/+1 actual change)
        config.playerPets[1] = createPet('Ant', 49, 49);

        config.opponentPets[0] = createPet('Fish', 1, 1);

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];

        const removalLog = logs.find((log: any) =>
            typeof log?.message === 'string' &&
            log.message.includes('(Giant Otter Buffs removed)')
        );

        expect(removalLog).toBeDefined();
        // It should have only lost 1/1 because the cap was reached
        expect(removalLog.message).toBe('Ant lost 1 attack and 1 health (Giant Otter Buffs removed)');
    });

    it('removes full stats when cap is not reached', () => {
        const config = createBaseConfig();
        config.logsEnabled = true;

        // Giant Otter (Level 1) gives +2/+5
        config.playerPets[0] = createPet('Giant Otter', 4, 3);
        config.playerPets[1] = createPet('Ant', 10, 10);

        config.opponentPets[0] = createPet('Fish', 1, 1);

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];

        const removalLog = logs.find((log: any) =>
            typeof log?.message === 'string' &&
            log.message.includes('(Giant Otter Buffs removed)')
        );

        expect(removalLog).toBeDefined();
        expect(removalLog.message).toBe('Ant lost 2 attack and 5 health (Giant Otter Buffs removed)');
    });
});
