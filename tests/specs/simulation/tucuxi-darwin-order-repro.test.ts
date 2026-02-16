import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Tucuxi vs Darwin ordering', () => {
  it('resolves EnemyHurt Darwin jump before Tucuxi Faint push/buff from provided SAPC token', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Danger',
      playerToy: null,
      playerToyLevel: 1,
      playerHardToy: null,
      playerHardToyLevel: 1,
      opponentToy: null,
      opponentToyLevel: 1,
      opponentHardToy: null,
      opponentHardToyLevel: 1,
      turn: 4,
      playerGoldSpent: 12,
      opponentGoldSpent: 11,
      playerRollAmount: 3,
      opponentRollAmount: 2,
      playerSummonedAmount: 1,
      opponentSummonedAmount: 2,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 1,
      playerPets: [
        { name: 'Tucuxi', attack: 2, health: 3, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: 'Malay Tapir', attack: 2, health: 2, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: 'Araripe Manakin', attack: 3, health: 2, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: 'Togian Babirusa', attack: 3, health: 3, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: "Darwin's Fox", attack: 5, health: 8, exp: 0, mana: 0, equipment: { name: 'Sudduth Tomato' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
      ],
      opponentPets: [
        { name: 'Tucuxi', attack: 4, health: 10, exp: 0, mana: 0, equipment: { name: 'Sudduth Tomato' }, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: 'Volcano Snail', attack: 3, health: 4, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: 'Volcano Snail', attack: 1, health: 4, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: "Darwin's Fox", attack: 3, health: 4, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
        { name: 'Proboscis Monkey', attack: 4, health: 4, exp: 0, mana: 0, equipment: null, triggersConsumed: 0, battlesFought: 0, timesHurt: 0, belugaSwallowedPet: null, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null },
      ],
      allPets: false,
      customPacks: [],
      oldStork: false,
      tokenPets: true,
      komodoShuffle: false,
      mana: true,
      showAdvanced: true,
      showSwallowedLevels: false,
      showTriggerNamesInLogs: true,
      ailmentEquipment: false,
      changeEquipmentUses: false,
      logsEnabled: true,
      simulationCount: 1,
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const messages = logs.map((log: any) => String(log?.message ?? ''));
    const jumpLogs = logs
      .map((log: any, idx: number) => ({ log, idx }))
      .filter(
        ({ log }) =>
          log?.type === 'attack' &&
          typeof log?.message === 'string' &&
          log.message.includes("Darwin's Fox jump-attacks"),
      );

    const firstPlayerJump = jumpLogs.find(
      ({ log }) => log?.sourcePet?.parent?.isOpponent === false,
    );
    const firstOpponentJump = jumpLogs.find(
      ({ log }) => log?.sourcePet?.parent?.isOpponent === true,
    );

    const faintIdx = messages.findIndex((msg) => msg.includes('Tucuxi fainted.'));
    const pushIdx = messages.findIndex((msg) =>
      msg.includes('Tucuxi pushed Darwin\'s Fox to the front'),
    );

    expect(firstPlayerJump).toBeDefined();
    expect(firstOpponentJump).toBeDefined();
    expect(firstPlayerJump!.idx).toBeLessThan(firstOpponentJump!.idx);
    expect(firstPlayerJump!.idx).toBeLessThan(faintIdx);
    expect(firstPlayerJump!.idx).toBeLessThan(pushIdx);
  });
});
