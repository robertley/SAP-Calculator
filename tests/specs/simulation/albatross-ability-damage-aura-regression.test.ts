import { describe, expect, it } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';

describe('Albatross ability damage aura regression', () => {
  it('boosts adjacent copied Geometric Tortoise ability damage', () => {
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
          abominationSwallowedPet1: 'Geometric Tortoise',
          abominationSwallowedPet1Level: 3,
        },
        {
          name: 'Abomination',
          attack: 10,
          health: 10,
          exp: 5,
          abominationSwallowedPet1: 'Albatross',
          abominationSwallowedPet1Level: 2,
        },
        null,
        null,
        null,
      ],
      opponentPets: [
        { name: 'Ant', attack: 1, health: 50, exp: 0 },
        null,
        null,
        null,
        null,
      ],
    };

    const result = runSimulation(config);
    const logs = result.battles?.[0]?.logs ?? [];
    const geometricSnipeWithAlbatrossAura = logs.find(
      (log) =>
        typeof log.message === 'string' &&
        log.message.includes("Abomination's Geometric Tortoise sniped Ant for 7.") &&
        log.message.includes('(+6 Albatross)'),
    );

    expect(geometricSnipeWithAlbatrossAura).toBeDefined();
  });
});
