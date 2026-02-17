import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('danger start battle stall regression', () => {
  it('fires StartBattle abilities for Iriomote transformed pets', () => {
    const baseConfig: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Danger',
      turn: 10,
      playerGoldSpent: 0,
      opponentGoldSpent: 0,
      tokenPets: true,
      mana: true,
      logsEnabled: true,
      simulationCount: 1,
      captureRandomDecisions: true,
      playerPets: [
        { name: 'Ant', attack: 5, health: 5, exp: 0 },
        { name: 'Iriomote Cat', attack: 10, health: 10, exp: 5 },
        { name: 'Fish', attack: 5, health: 5, exp: 0 },
      ],
      opponentPets: [{ name: 'Pig', attack: 1, health: 50, exp: 0 }],
    };

    const warmup = runSimulation(baseConfig);
    const iriomoteDecision = (warmup.randomDecisions ?? []).find(
      (entry) => entry.key === 'pet.iriomote-cat-transform',
    );
    expect(iriomoteDecision).toBeDefined();

    const blueDragonOption = iriomoteDecision?.options.find(
      (option) => option.id === 'Blue Dragon',
    );
    expect(blueDragonOption).toBeDefined();

    const forced = runSimulation({
      ...baseConfig,
      strictRandomOverrideValidation: true,
      randomDecisionOverrides: [
        {
          index: iriomoteDecision!.index,
          key: iriomoteDecision!.key,
          optionId: blueDragonOption!.id,
        },
      ],
    });

    const logs = forced.battles?.[0]?.logs ?? [];
    const transformLog = logs.find((log) =>
      String(log?.message ?? '').includes(
        'Iriomote Cat transformed into a Blue Dragon',
      ),
    );
    const blueDragonStartBattleLog = logs.find((log) =>
      String(log?.message ?? '').includes('Blue Dragon gave 1 friend ahead'),
    );

    expect(forced.randomOverrideError ?? null).toBeNull();
    expect(transformLog).toBeDefined();
    expect(blueDragonStartBattleLog).toBeDefined();
  });

  it(
    'single simulation without logs completes quickly',
    () => {
      const config: SimulationConfig = {
        playerPack: 'Danger',
        opponentPack: 'Danger',
        turn: 12,
        playerGoldSpent: 10,
        opponentGoldSpent: 11,
        tokenPets: true,
        mana: true,
        logsEnabled: false,
        simulationCount: 1,
        playerPets: [
          { name: 'Silky Sifaka', attack: 9, health: 12, exp: 1 },
          {
            name: 'Tree Kangaroo',
            attack: 12,
            health: 24,
            exp: 2,
            equipment: { name: 'Sudduth Tomato' },
          },
          { name: 'Humphead Wrasse', attack: 11, health: 8, exp: 2 },
          { name: 'California Condor', attack: 11, health: 7, exp: 1 },
          {
            name: 'Black Rhino',
            attack: 10,
            health: 15,
            exp: 2,
            equipment: { name: 'Melon' },
          },
        ],
        opponentPets: [
          { name: 'Painted Terrapin', attack: 6, health: 8, exp: 2 },
          {
            name: 'Iriomote Cat',
            attack: 22,
            health: 27,
            exp: 5,
            equipment: { name: 'Salt' },
          },
          { name: 'Geometric Tortoise', attack: 12, health: 16, exp: 0 },
          {
            name: 'Sumatran Tiger',
            attack: 10,
            health: 10,
            exp: 1,
            equipment: { name: 'Steak' },
          },
          { name: 'Sumatran Tiger', attack: 9, health: 9, exp: 0 },
        ],
      };

      const result = runSimulation(config);
      expect(result.playerWins + result.opponentWins + result.draws).toBe(1);
    },
    5000,
  );

  it(
    'completes simulation with dual Sumatran Tiger + Iriomote Cat setup',
    () => {
      const config: SimulationConfig = {
        playerPack: 'Danger',
        opponentPack: 'Danger',
        turn: 12,
        playerGoldSpent: 10,
        opponentGoldSpent: 11,
        tokenPets: true,
        mana: true,
        logsEnabled: true,
        simulationCount: 20,
        playerPets: [
          { name: 'Silky Sifaka', attack: 9, health: 12, exp: 1 },
          {
            name: 'Tree Kangaroo',
            attack: 12,
            health: 24,
            exp: 2,
            equipment: { name: 'Sudduth Tomato' },
          },
          { name: 'Humphead Wrasse', attack: 11, health: 8, exp: 2 },
          { name: 'California Condor', attack: 11, health: 7, exp: 1 },
          {
            name: 'Black Rhino',
            attack: 10,
            health: 15,
            exp: 2,
            equipment: { name: 'Melon' },
          },
        ],
        opponentPets: [
          { name: 'Painted Terrapin', attack: 6, health: 8, exp: 2 },
          {
            name: 'Iriomote Cat',
            attack: 22,
            health: 27,
            exp: 5,
            equipment: { name: 'Salt' },
          },
          { name: 'Geometric Tortoise', attack: 12, health: 16, exp: 0 },
          {
            name: 'Sumatran Tiger',
            attack: 10,
            health: 10,
            exp: 1,
            equipment: { name: 'Steak' },
          },
          { name: 'Sumatran Tiger', attack: 9, health: 9, exp: 0 },
        ],
      };

      const result = runSimulation(config);

      expect(result.playerWins + result.opponentWins + result.draws).toBe(20);
    },
    15000,
  );

  it(
    'single simulation with logs generates bounded log volume',
    () => {
      const config: SimulationConfig = {
        playerPack: 'Danger',
        opponentPack: 'Danger',
        turn: 12,
        playerGoldSpent: 10,
        opponentGoldSpent: 11,
        tokenPets: true,
        mana: true,
        logsEnabled: true,
        simulationCount: 1,
        playerPets: [
          { name: 'Silky Sifaka', attack: 9, health: 12, exp: 1 },
          {
            name: 'Tree Kangaroo',
            attack: 12,
            health: 24,
            exp: 2,
            equipment: { name: 'Sudduth Tomato' },
          },
          { name: 'Humphead Wrasse', attack: 11, health: 8, exp: 2 },
          { name: 'California Condor', attack: 11, health: 7, exp: 1 },
          {
            name: 'Black Rhino',
            attack: 10,
            health: 15,
            exp: 2,
            equipment: { name: 'Melon' },
          },
        ],
        opponentPets: [
          { name: 'Painted Terrapin', attack: 6, health: 8, exp: 2 },
          {
            name: 'Iriomote Cat',
            attack: 22,
            health: 27,
            exp: 5,
            equipment: { name: 'Salt' },
          },
          { name: 'Geometric Tortoise', attack: 12, health: 16, exp: 0 },
          {
            name: 'Sumatran Tiger',
            attack: 10,
            health: 10,
            exp: 1,
            equipment: { name: 'Steak' },
          },
          { name: 'Sumatran Tiger', attack: 9, health: 9, exp: 0 },
        ],
      };

      const result = runSimulation(config);
      const logs = result.battles?.[0]?.logs ?? [];
      // Keep this assertion loose; it is a diagnostic guard against runaway log growth in one battle.
      expect(logs.length).toBeLessThan(5000);
      expect(result.playerWins + result.opponentWins + result.draws).toBe(1);
    },
    10000,
  );

  it(
    '100 simulations without logs should finish',
    () => {
      const config: SimulationConfig = {
        playerPack: 'Danger',
        opponentPack: 'Danger',
        turn: 12,
        playerGoldSpent: 10,
        opponentGoldSpent: 11,
        tokenPets: true,
        mana: true,
        logsEnabled: false,
        simulationCount: 100,
        playerPets: [
          { name: 'Silky Sifaka', attack: 9, health: 12, exp: 1 },
          {
            name: 'Tree Kangaroo',
            attack: 12,
            health: 24,
            exp: 2,
            equipment: { name: 'Sudduth Tomato' },
          },
          { name: 'Humphead Wrasse', attack: 11, health: 8, exp: 2 },
          { name: 'California Condor', attack: 11, health: 7, exp: 1 },
          {
            name: 'Black Rhino',
            attack: 10,
            health: 15,
            exp: 2,
            equipment: { name: 'Melon' },
          },
        ],
        opponentPets: [
          { name: 'Painted Terrapin', attack: 6, health: 8, exp: 2 },
          {
            name: 'Iriomote Cat',
            attack: 22,
            health: 27,
            exp: 5,
            equipment: { name: 'Salt' },
          },
          { name: 'Geometric Tortoise', attack: 12, health: 16, exp: 0 },
          {
            name: 'Sumatran Tiger',
            attack: 10,
            health: 10,
            exp: 1,
            equipment: { name: 'Steak' },
          },
          { name: 'Sumatran Tiger', attack: 9, health: 9, exp: 0 },
        ],
      };

      const result = runSimulation(config);
      expect(result.playerWins + result.opponentWins + result.draws).toBe(100);
    },
    15000,
  );
});
