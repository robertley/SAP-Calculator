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

  it('labels equipment decisions with the equipment owner', () => {
    const config: SimulationConfig = {
      playerPack: 'Star',
      opponentPack: 'Star',
      turn: 12,
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
        {
          name: 'Darwin\'s Fox',
          attack: 1,
          health: 1,
          exp: 0,
          mana: 0,
          equipment: { name: 'Popcorn' },
        },
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
      .filter((decision) => decision.key === 'equipment.popcorn-summon')
      .map((decision) => decision.label);

    expect(labels).toContain("(P1) Popcorn (Darwin's Fox) summon 1");
  });

  it('captures and applies Leaf Gecko random target/ailment overrides', () => {
    const baseConfig: SimulationConfig = {
      playerPack: 'Custom',
      opponentPack: 'Custom',
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
        { name: 'Leaf Gecko', attack: 1, health: 1, exp: 0, mana: 0, equipment: null },
        { name: 'Ant', attack: 2, health: 2, exp: 0, mana: 0, equipment: null },
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Elephant', attack: 10, health: 10, exp: 0, mana: 0, equipment: null },
        { name: 'Fish', attack: 3, health: 3, exp: 0, mana: 0, equipment: null },
        null,
        null,
        null,
      ],
      captureRandomDecisions: true,
      maxLoggedBattles: 1,
    };

    const captureResult = runSimulation(baseConfig);
    const targetDecision = (captureResult.randomDecisions ?? []).find(
      (decision) => decision.key === 'pet.leaf-gecko-target',
    );
    const ailmentDecision = (captureResult.randomDecisions ?? []).find(
      (decision) => decision.key === 'pet.leaf-gecko-ailment',
    );

    expect(targetDecision).toBeDefined();
    expect(ailmentDecision).toBeDefined();

    const forcedTargetOption = targetDecision!.options[0];
    const forcedAilmentOption =
      ailmentDecision!.options.find((option) => option.id === 'Weak') ??
      ailmentDecision!.options[0];

    const forcedResult = runSimulation({
      ...baseConfig,
      randomDecisionOverrides: [
        {
          index: targetDecision!.index,
          optionId: forcedTargetOption.id,
        },
        {
          index: ailmentDecision!.index,
          optionId: forcedAilmentOption.id,
        },
      ],
      strictRandomOverrideValidation: true,
    });

    expect(forcedResult.randomOverrideError ?? null).toBeNull();

    const forcedTargetDecision = (forcedResult.randomDecisions ?? []).find(
      (decision) => decision.index === targetDecision!.index,
    );
    const forcedAilmentDecision = (forcedResult.randomDecisions ?? []).find(
      (decision) => decision.index === ailmentDecision!.index,
    );

    expect(forcedTargetDecision?.selectedOptionId).toBe(forcedTargetOption.id);
    expect(forcedAilmentDecision?.selectedOptionId).toBe(forcedAilmentOption.id);
    expect(forcedTargetDecision?.forced).toBe(true);
    expect(forcedAilmentDecision?.forced).toBe(true);

    const logs = forcedResult.battles?.[0]?.logs ?? [];
    const leafGeckoLog = logs.find((log) =>
      String(log?.message ?? '').includes('Leaf Gecko cursed'),
    );
    expect(leafGeckoLog).toBeDefined();
    const leafGeckoMessage = String(leafGeckoLog?.message ?? '');
    expect(leafGeckoMessage).not.toContain('could not apply any random ailments');
    expect(leafGeckoMessage).toContain(':');
    expect(leafGeckoMessage).toContain('(');
    expect(leafGeckoMessage).toContain(')');
  });

  it('captures and applies Cocoa Bean transform overrides and flags random logs', () => {
    const baseConfig: SimulationConfig = {
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
        {
          name: 'Ant',
          attack: 1,
          health: 8,
          exp: 0,
          mana: 0,
          equipment: { name: 'Cocoa Bean' },
        },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Elephant', attack: 10, health: 10, exp: 0, mana: 0, equipment: null },
        { name: 'Fish', attack: 4, health: 4, exp: 0, mana: 0, equipment: null },
        null,
        null,
        null,
      ],
      captureRandomDecisions: true,
      maxLoggedBattles: 1,
    };

    const captureResult = runSimulation(baseConfig);
    const decision = (captureResult.randomDecisions ?? []).find(
      (entry) => entry.key === 'equipment.cocoa-bean-transform',
    );

    expect(decision).toBeDefined();
    expect((decision?.options?.length ?? 0) > 1).toBe(true);

    const cocoaLog = (captureResult.battles?.[0]?.logs ?? []).find(
      (log) =>
        String(log?.message ?? '').includes('(Cocoa Bean)') &&
        log?.type === 'equipment',
    );
    expect(cocoaLog?.randomEvent).toBe(true);

    const forcedOption = decision!.options.find((option) => option.id.includes(':Fish')) ?? decision!.options[0];
    const forcedResult = runSimulation({
      ...baseConfig,
      randomDecisionOverrides: [
        {
          index: decision!.index,
          optionId: forcedOption.id,
        },
      ],
      strictRandomOverrideValidation: true,
    });

    expect(forcedResult.randomOverrideError ?? null).toBeNull();
    const forcedDecision = (forcedResult.randomDecisions ?? []).find(
      (entry) => entry.index === decision!.index,
    );
    expect(forcedDecision?.selectedOptionId).toBe(forcedOption.id);
    expect(forcedDecision?.forced).toBe(true);
  });

  it('captures Cocoa Bean transform random event in the user shared SAPC1 case', () => {
    const config: SimulationConfig = {
      playerPack: 'Danger',
      opponentPack: 'Unicorn',
      playerToyLevel: 1,
      opponentToyLevel: 1,
      playerHardToyLevel: 1,
      opponentHardToyLevel: 1,
      turn: 11,
      playerGoldSpent: 13,
      opponentGoldSpent: 17,
      playerRollAmount: 1,
      opponentRollAmount: 5,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 1,
      playerSummonedAmount: 2,
      opponentSummonedAmount: 2,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 0,
      mana: true,
      showAdvanced: true,
      simulationCount: 1,
      logsEnabled: true,
      maxLoggedBattles: 1,
      captureRandomDecisions: true,
      playerPets: [
        {
          name: 'Hawaiian Monk Seal',
          attack: 3,
          health: 4,
          exp: 0,
          mana: 0,
          equipment: { name: 'Cocoa Bean' },
        },
        {
          name: 'Iriomote Cat',
          attack: 17,
          health: 25,
          exp: 2,
          mana: 0,
          equipment: { name: 'Maple Syrup' },
        },
        {
          name: 'Green Sea Turtle',
          attack: 5,
          health: 6,
          exp: 0,
          mana: 0,
          equipment: null,
        },
        {
          name: 'Black Rhino',
          attack: 7,
          health: 15,
          exp: 2,
          mana: 0,
          equipment: null,
        },
        {
          name: 'Marine Iguana',
          attack: 4,
          health: 5,
          exp: 0,
          mana: 0,
          equipment: null,
        },
      ],
      opponentPets: [
        {
          name: 'Bunyip',
          attack: 26,
          health: 26,
          exp: 5,
          mana: 0,
          equipment: { name: 'Ambrosia' },
        },
        {
          name: 'Cerberus',
          attack: 12,
          health: 12,
          exp: 2,
          mana: 0,
          equipment: null,
        },
        {
          name: 'Quetzalcoatl',
          attack: 8,
          health: 12,
          exp: 3,
          mana: 0,
          equipment: null,
        },
        {
          name: 'Quetzalcoatl',
          attack: 4,
          health: 8,
          exp: 0,
          mana: 0,
          equipment: null,
        },
        {
          name: 'Team Spirit',
          attack: 4,
          health: 5,
          exp: 0,
          mana: 0,
          equipment: null,
        },
      ],
    };

    const result = runSimulation(config);
    const cocoaDecision = (result.randomDecisions ?? []).find(
      (entry) => entry.key === 'equipment.cocoa-bean-transform',
    );
    const cocoaLog = (result.battles?.[0]?.logs ?? []).find(
      (log) =>
        log?.type === 'equipment' &&
        String(log?.message ?? '').includes('(Cocoa Bean)'),
    );

    expect(cocoaDecision).toBeDefined();
    expect(cocoaLog).toBeDefined();
    expect(cocoaLog?.randomEvent).toBe(true);
  });
});
