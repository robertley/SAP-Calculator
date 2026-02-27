import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('snipe log unrelated multiplier regression', () => {
  it('does not append equipment multiplier tags when non-snipe equipment is irrelevant', () => {
    const config: SimulationConfig = {
      playerPack: 'Unicorn',
      opponentPack: 'Turtle',
      turn: 11,
      logsEnabled: true,
      simulationCount: 1,
      playerPets: [
        {
          name: 'Abomination',
          attack: 10,
          health: 10,
          exp: 5,
          equipment: { name: 'Carrot' },
          abominationSwallowedPet1: 'Geometric Tortoise',
          abominationSwallowedPet1Level: 3,
          abominationSwallowedPet2: 'Panther',
          abominationSwallowedPet2Level: 3,
        },
        null,
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 3, health: 50, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const geometricSnipeLog = logs.find(
      (log) =>
        typeof log.message === 'string' &&
        log.message.includes("Abomination's Geometric Tortoise sniped"),
    );

    expect(geometricSnipeLog).toBeDefined();
    expect(geometricSnipeLog?.message).not.toContain('(Panther)');
  });
});
