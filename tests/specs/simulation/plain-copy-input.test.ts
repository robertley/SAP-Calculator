import { describe, expect, it } from 'vitest';
import { SimulationConfig } from 'app/domain/interfaces/simulation-config.interface';
import { CalculatorBattleEngine } from 'app/integrations/simulation/battle-engine';

function createConfig(plainCopy: boolean): SimulationConfig {
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    turn: 1,
    seed: 1,
    simulationCount: 1,
    logsEnabled: true,
    playerPets: [
      { name: 'Ant', attack: 2, health: 1, plainCopy },
      { name: 'Fish', attack: 2, health: 10 },
    ],
    opponentPets: [{ name: 'Pig', attack: 3, health: 20 }],
  };
}

describe('plain-copy simulation input', () => {
  it('removes the native pet ability while preserving the pet identity', () => {
    const engine = new CalculatorBattleEngine();
    const normalLogs = engine.run(createConfig(false)).battles?.[0]?.logs ?? [];
    const plainCopyLogs = engine.run(createConfig(true)).battles?.[0]?.logs ?? [];

    expect(normalLogs.some((log) => log.message.includes('Ant gave Fish'))).toBe(
      true,
    );
    expect(
      plainCopyLogs.some((log) => log.message.includes('Ant gave Fish')),
    ).toBe(false);
    expect(
      plainCopyLogs.some((log) => log.message.includes('Ant attacks Pig')),
    ).toBe(true);
  });
});
