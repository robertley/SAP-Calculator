import { describe, it, expect, vi } from 'vitest';
import { Silly } from '../../../src/app/domain/entities/catalog/equipment/ailments/silly.class';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Silly Giant Pangasius', () => {
    it('can snipe its own team when Silly is active', () => {
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
        try {
            const config: SimulationConfig = {
                playerPack: 'Danger',
                opponentPack: 'Turtle',
                turn: 5,
                playerGoldSpent: 10,
                opponentGoldSpent: 10,
                playerPets: [
                    {
                        name: 'Giant Pangasius',
                        attack: 4,
                        health: 5,
                        exp: 0,
                        equipment: new Silly(),
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
                    {
                        name: 'Fish',
                        attack: 2,
                        health: 6,
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
                ],
                opponentPets: [
                    {
                        name: 'Ant',
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
                simulationCount: 1,
                oldStork: false,
                tokenPets: false,
                komodoShuffle: false,
                mana: false,
                playerRollAmount: 0,
                opponentRollAmount: 0,
                playerSummonedAmount: 0,
                opponentSummonedAmount: 0,
                playerTransformationAmount: 1,
                opponentTransformationAmount: 0,
                playerLevel3Sold: 0,
                opponentLevel3Sold: 0,
            };

            const result = runSimulation(config);
            const logs = result.battles?.[0]?.logs ?? [];
            const snipedFriendly = logs.some(
                (log: any) =>
                    log.type === 'attack' &&
                    typeof log.message === 'string' &&
                    log.message.includes('sniped') &&
                    log.message.includes('Fish'),
            );

            expect(snipedFriendly).toBe(true);
        } finally {
            randomSpy.mockRestore();
        }
    });
});



