import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Philippine Eagle start of battle priority', () => {
  it('resolves remaining StartBattle abilities before AnyoneJumped reactions', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Danger',
      turn: 12,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      tokenPets: true,
      mana: true,
      logsEnabled: true,
      simulationCount: 1,
      showTriggerNamesInLogs: true,
      playerPets: [
        { name: 'Sumatran Tiger', attack: 20, health: 20, exp: 0 },
        { name: 'Snow Leopard', attack: 10, health: 20, exp: 0 },
        { name: 'Philippine Eagle', attack: 7, health: 20, exp: 0 },
      ],
      opponentPets: [
        { name: 'Pig', attack: 1, health: 100, exp: 0 },
        { name: 'Pig', attack: 1, health: 100, exp: 0 },
      ],
    };

    const result = runSimulation(config);
    const messages = (result.battles?.[0]?.logs ?? []).map((log) =>
      String(log?.message ?? ''),
    );

    const snowLeopardStartBattleIdx = messages.findIndex((message) =>
      message.includes('Snow Leopard gave Snow Leopard'),
    );
    const philippineEagleJumpReactionIdx = messages.findIndex((message) =>
      message.includes('Philippine Eagle gave'),
    );

    expect(snowLeopardStartBattleIdx).toBeGreaterThan(-1);
    expect(philippineEagleJumpReactionIdx).toBeGreaterThan(-1);
    expect(snowLeopardStartBattleIdx).toBeLessThan(
      philippineEagleJumpReactionIdx,
    );
  });

  it('does not resolve Philippine Eagle jump reaction before Woodpecker StartBattle snipes', () => {
    const config: SimulationConfig = {
      playerPack: 'Star',
      opponentPack: 'Danger',
      turn: 12,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      tokenPets: true,
      mana: true,
      logsEnabled: true,
      simulationCount: 1,
      showTriggerNamesInLogs: true,
      seed: 12345,
      playerPets: [
        { name: 'Woodpecker', attack: 6, health: 20, exp: 1 },
        { name: 'Fish', attack: 20, health: 20, exp: 0 },
        { name: 'Fish', attack: 20, health: 20, exp: 0 },
        { name: 'Fish', attack: 20, health: 20, exp: 0 },
        { name: 'Fish', attack: 20, health: 20, exp: 0 },
      ],
      opponentPets: [
        { name: 'Painted Terrapin', attack: 6, health: 12, exp: 0 },
        { name: 'Philippine Eagle', attack: 7, health: 12, exp: 2 },
        {
          name: 'Tasmanian Devil',
          attack: 7,
          health: 12,
          exp: 0,
          equipment: { name: 'White Truffle' },
        },
        {
          name: 'Sumatran Tiger',
          attack: 7,
          health: 12,
          exp: 0,
          equipment: { name: 'White Okra' },
        },
        { name: 'Black Rhino', attack: 7, health: 12, exp: 0 },
      ],
    };

    const result = runSimulation(config);
    const messages = (result.battles?.[0]?.logs ?? []).map((log) =>
      String(log?.message ?? ''),
    );
    const firstPhilippineJumpBuffIdx = messages.findIndex((message) =>
      message.includes('Philippine Eagle gave'),
    );
    const firstWoodpeckerSnipeIdx = messages.findIndex((message) =>
      message.includes('Woodpecker sniped'),
    );

    expect(firstPhilippineJumpBuffIdx).toBeGreaterThan(-1);
    expect(firstWoodpeckerSnipeIdx).toBeGreaterThan(-1);
    expect(firstWoodpeckerSnipeIdx).toBeLessThan(firstPhilippineJumpBuffIdx);
  });
});
