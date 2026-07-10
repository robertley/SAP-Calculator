import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('knockout and faint ordering', () => {
  it('resolves the defeated pet faint before the killer knockout effect', () => {
    const config: SimulationConfig = {
      playerPack: 'Turtle',
      opponentPack: 'Golden',
      turn: 15,
      playerGoldSpent: 10,
      opponentGoldSpent: 12,
      playerRollAmount: 1,
      opponentRollAmount: 6,
      playerSummonedAmount: 1,
      opponentSummonedAmount: 0,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 0,
      playerPets: [
        { name: 'Rhino', attack: 18, health: 23, exp: 2, mana: 0, equipment: { name: 'Melon' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Tiger', attack: 12, health: 10, exp: 2, mana: 0, equipment: { name: 'Melon' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Rat', attack: 15, health: 24, exp: 2, mana: 0, equipment: { name: 'Garlic' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Cow', attack: 4, health: 6, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Shark', attack: 23, health: 27, exp: 2, mana: 0, equipment: { name: 'Melon' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
      ],
      opponentPets: [
        { name: 'Beluga Whale', attack: 4, health: 7, exp: 2, mana: 0, equipment: { name: 'Chocolate Cake' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: 'Warthog' },
        { name: 'Weasel', attack: 8, health: 11, exp: 2, mana: 0, equipment: { name: 'Pita Bread' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Grizzly Bear', attack: 10, health: 15, exp: 2, mana: 0, equipment: { name: 'Pita Bread' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Falcon', attack: 7, health: 7, exp: 2, mana: 0, equipment: { name: 'Tomato' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
        { name: 'Saiga Antelope', attack: 5, health: 5, exp: 2, mana: 0, equipment: { name: 'Banana' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0 },
      ],
      customPacks: [],
      allPets: false,
      oldStork: false,
      tokenPets: true,
      komodoShuffle: false,
      mana: true,
      simulationCount: 1,
      logsEnabled: true,
    };

    const messages = (runSimulation(config).battles?.[0]?.logs ?? []).map(
      (log) => log.message,
    );
    const warthogFaintIndex = messages.indexOf('Warthog fainted.');
    const firstRhinoKnockoutIndex = messages.findIndex((message) =>
      message.startsWith('Rhino sniped'),
    );

    expect(warthogFaintIndex).toBeGreaterThan(-1);
    expect(firstRhinoKnockoutIndex).toBeGreaterThan(-1);
    expect(warthogFaintIndex).toBeLessThan(firstRhinoKnockoutIndex);
  });
});
