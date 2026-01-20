import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../../simulation/simulate';

describe('Nessie roll count across simulations', () => {
    it('uses the configured roll amount on the second simulation', () => {
        const rollAmount = 7;
        const config: SimulationConfig = {
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            turn: 11,
            playerGoldSpent: 10,
            opponentGoldSpent: 10,
            playerRollAmount: rollAmount,
            opponentRollAmount: 4,
            playerPets: [
                {
                    name: 'Nessie',
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
                    timesHurt: 0
                },
                null,
                null,
                null,
                null
            ],
            opponentPets: [
                {
                    name: 'Mouse',
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
                    timesHurt: 0
                },
                null,
                null,
                null,
                null
            ],
            simulationCount: 2,
            oldStork: false,
            tokenPets: false,
            komodoShuffle: false,
            mana: false,
            playerSummonedAmount: 0,
            opponentSummonedAmount: 0,
            playerTransformationAmount: 0,
            opponentTransformationAmount: 0,
            playerLevel3Sold: 0,
            opponentLevel3Sold: 0
        };

        const result = runSimulation(config);

        expect(result.battles?.length).toBe(2);

        const expectedAttack = 3 + rollAmount;
        const expectedHealth = 3 + rollAmount;
        const expectedBonus = `+${rollAmount}/+${rollAmount}`;
        const expectedStats = `${expectedAttack}/${expectedHealth}`;

        const getFirstBoatMessage = (battleIndex: number) => {
            const logs = result.battles?.[battleIndex]?.logs ?? [];
            const entry = logs.find((log) =>
                log.type === 'ability' &&
                typeof log.message === 'string' &&
                log.message.includes('spawned a Nessie?') &&
                log.message.includes('first Boat')
            );
            return entry?.message ?? '';
        };

        const firstBattleMessage = getFirstBoatMessage(0);
        const secondBattleMessage = getFirstBoatMessage(1);

        expect(firstBattleMessage).toContain(`Nessie spawned a Nessie? ${expectedStats}`);
        expect(firstBattleMessage).toContain(`It's the first Boat, so it gains ${expectedBonus}!`);

        expect(secondBattleMessage).toContain(`Nessie spawned a Nessie? ${expectedStats}`);
        expect(secondBattleMessage).toContain(`It's the first Boat, so it gains ${expectedBonus}!`);
    });
});