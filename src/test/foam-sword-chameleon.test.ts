
import { describe, it, expect } from 'vitest';
import { runSimulation } from '../../simulation/simulate';
import { SimulationConfig } from './interfaces/simulation-config.interface';

describe('Foam Sword Chameleon Interaction', () => {
    it('should result in a draw', () => {
        const config: SimulationConfig = {
            "playerPack": "Turtle",
            "opponentPack": "Puppy",
            "playerToy": null,
            "playerToyLevel": 1,
            "opponentToy": "Foam Sword",
            "opponentToyLevel": 2,
            "turn": 9,
            "playerGoldSpent": 11,
            "opponentGoldSpent": 12,
            "allPets": false,
            "playerPets": [
                {
                    "name": "Bee",
                    "attack": 50,
                    "health": 5,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": "Bee",
                    "attack": 50,
                    "health": 5,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": "Bee",
                    "attack": 50,
                    "health": 5,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": "Bee",
                    "attack": 50,
                    "health": 5,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": "Bee",
                    "attack": 5,
                    "health": 6,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                }
            ],
            "opponentPets": [
                {
                    "name": "Chameleon",
                    "attack": 6,
                    "health": 5,
                    "exp": 2,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": null,
                    "attack": 0,
                    "health": 0,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": null,
                    "attack": 0,
                    "health": 0,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": null,
                    "attack": 0,
                    "health": 0,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                },
                {
                    "name": null,
                    "attack": 0,
                    "health": 0,
                    "exp": 0,
                    "equipment": null,
                    "belugaSwallowedPet": null,
                    "mana": 0,
                    "triggersConsumed": 0,
                    "abominationSwallowedPet1": null,
                    "abominationSwallowedPet2": null,
                    "abominationSwallowedPet3": null,
                    "battlesFought": 0,
                    "timesHurt": 0
                }
            ],
            "simulationCount": 1,
            // Defaults or explicit false from JSON
            "oldStork": false,
            "tokenPets": false,
            "komodoShuffle": false,
            "mana": true,
            "playerRollAmount": 4,
            "opponentRollAmount": 6,
            "playerLevel3Sold": 0,
            "opponentLevel3Sold": 0,
            "playerSummonedAmount": 1,
            "opponentSummonedAmount": 2,
            "playerTransformationAmount": 0,
            "opponentTransformationAmount": 0
        };

        const result = runSimulation(config);

        expect(result.draws).toBe(1);
    });
});
