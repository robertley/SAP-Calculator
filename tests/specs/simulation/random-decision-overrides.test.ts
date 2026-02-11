import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('random decision overrides', () => {
  it('captures Orca faint spawn options and forces a selected spawn', () => {
    const baseConfig: SimulationConfig = {
      playerPack: 'Star',
      opponentPack: 'Star',
      turn: 11,
      simulationCount: 1,
      logsEnabled: true,
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
      playerPets: [
        { name: 'Orca', attack: 1, health: 1, exp: 0, mana: 0, equipment: null },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 20, health: 20, exp: 0, mana: 0, equipment: null },
        null,
        null,
        null,
        null,
      ],
      captureRandomDecisions: true,
      maxLoggedBattles: 1,
    };

    const captureResult = runSimulation(baseConfig);
    const orcaDecision = (captureResult.randomDecisions ?? []).find(
      (decision) => decision.key === 'pet.random-faint-pet',
    );

    expect(orcaDecision).toBeDefined();
    expect((orcaDecision?.options?.length ?? 0) > 1).toBe(true);

    const forcedOption = orcaDecision!.options[0];
    const forcedResult = runSimulation({
      ...baseConfig,
      randomDecisionOverrides: [
        {
          index: orcaDecision!.index,
          optionId: forcedOption.id,
        },
      ],
      strictRandomOverrideValidation: true,
    });

    const logs = forcedResult.battles?.[0]?.logs ?? [];
    const spawnedForcedPet = logs.some((log) =>
      String(log?.message ?? '').includes(
        `Orca spawned a 6/6 ${forcedOption.label}.`,
      ),
    );

    expect(spawnedForcedPet).toBe(true);
    expect(forcedResult.randomOverrideError ?? null).toBeNull();
  });

  it('labels Bay Cat summon decisions with position and summon number', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Danger',
      turn: 11,
      simulationCount: 1,
      logsEnabled: true,
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
      playerPets: [
        { name: 'Bay Cat', attack: 1, health: 1, exp: 2, mana: 0, equipment: null },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 20, health: 20, exp: 0, mana: 0, equipment: null },
        null,
        null,
        null,
        null,
      ],
      captureRandomDecisions: true,
      maxLoggedBattles: 1,
    };

    const result = runSimulation(config);
    const labels = (result.randomDecisions ?? [])
      .filter((decision) => decision.key === 'pet.bay-cat-summon')
      .map((decision) => decision.label);

    expect(labels).toContain('(P1) Bay Cat summon 1');
    expect(labels).toContain('(P1) Bay Cat summon 2');
  });
});
