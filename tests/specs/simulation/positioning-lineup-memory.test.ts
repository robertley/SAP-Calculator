import { describe, expect, it } from 'vitest';
import { PetConfig } from '../../../src/app/domain/interfaces/simulation-config.interface';
import { refreshPositioningLineupMemory } from '../../../src/app/integrations/simulation/positioning-lineup-memory';
import { runPositioningOptimization } from '../../../src/app/integrations/simulation/positioning-optimizer';

function pet(name: string, memory: Partial<PetConfig> = {}): PetConfig {
  return {
    name,
    attack: 1,
    health: 1,
    exp: 1,
    equipment: null,
    ...memory,
  };
}

describe('positioning lineup memory', () => {
  it('makes Parrot copy the nearest pet ahead and gives front Parrot no ability', () => {
    const original = [
      pet('Parrot', { parrotCopyPet: 'Fish' }),
      pet('Ant'),
      null,
      pet('Parrot', { parrotCopyPet: 'Otter' }),
    ];

    const refreshed = refreshPositioningLineupMemory(original);

    expect(refreshed[0]?.parrotCopyPet).toBeNull();
    expect(refreshed[3]?.parrotCopyPet).toBe('Ant');
    expect(original[0]?.parrotCopyPet).toBe('Fish');
    expect(original[3]?.parrotCopyPet).toBe('Otter');
  });

  it('resolves chains of Parrots to the effective copied ability', () => {
    const refreshed = refreshPositioningLineupMemory([
      pet('Fish'),
      pet('Parrot', { parrotCopyPet: 'Otter' }),
      pet('Parrot', { parrotCopyPet: 'Ant' }),
    ]);

    expect(refreshed[1]?.parrotCopyPet).toBe('Fish');
    expect(refreshed[2]?.parrotCopyPet).toBe('Fish');
  });

  it('moves copied Beluga and Abomination memory with the new target', () => {
    const refreshed = refreshPositioningLineupMemory([
      pet('Beluga Whale', { belugaSwallowedPet: 'Ant' }),
      pet('Parrot'),
      pet('Abomination', {
        abominationSwallowedPet1: 'Fish',
        abominationSwallowedPet1Level: 2,
      }),
      pet('Parrot'),
    ]);

    expect(refreshed[1]).toMatchObject({
      parrotCopyPet: 'Beluga Whale',
      parrotCopyPetBelugaSwallowedPet: 'Ant',
    });
    expect(refreshed[3]).toMatchObject({
      parrotCopyPet: 'Abomination',
      parrotCopyPetAbominationSwallowedPet1: 'Fish',
      parrotCopyPetAbominationSwallowedPet1Level: 2,
    });
  });

  it('refreshes Parrot for every candidate while preserving buff targets', () => {
    const seenLineups: (PetConfig | null)[][] = [];
    const playerPets = [
      pet('Fish'),
      pet('Parrot', { parrotCopyPet: 'Otter' }),
      pet('Ant'),
    ];

    runPositioningOptimization({
      baseConfig: {
        playerPack: 'Turtle',
        opponentPack: 'Turtle',
        turn: 9,
        playerPets,
        opponentPets: [],
        simulationCount: 1,
      },
      options: {
        side: 'player',
        maxSimulationsPerPermutation: 1,
        batchSize: 1,
        minSamplesBeforeElimination: 1,
        keepSameBuffTargets: true,
      },
      simulateBatch: (config) => {
        seenLineups.push(config.playerPets);
        return { playerWins: 0, opponentWins: 0, draws: 1 };
      },
    });

    expect(seenLineups.length).toBeGreaterThan(1);
    seenLineups.forEach((lineup) => {
      lineup.forEach((candidatePet, index) => {
        if (candidatePet?.name !== 'Parrot') {
          return;
        }
        const nearestAhead = lineup
          .slice(0, index)
          .reverse()
          .find((entry) => entry?.name);
        expect(candidatePet.parrotCopyPet).toBe(
          nearestAhead?.name === 'Parrot'
            ? nearestAhead.parrotCopyPet
            : nearestAhead?.name ?? null,
        );
      });
    });
  });

  it('preserves imported Parrot memory when recombination is disabled', () => {
    const seenCopies = new Set<string | null | undefined>();

    runPositioningOptimization({
      baseConfig: {
        playerPack: 'Turtle',
        opponentPack: 'Turtle',
        turn: 9,
        playerPets: [
          pet('Fish'),
          pet('Parrot', { parrotCopyPet: 'Otter' }),
          pet('Ant'),
        ],
        opponentPets: [],
        simulationCount: 1,
      },
      options: {
        side: 'player',
        maxSimulationsPerPermutation: 1,
        batchSize: 1,
        minSamplesBeforeElimination: 1,
        keepSameBuffTargets: true,
        recomputeParrotCopies: false,
      },
      simulateBatch: (config) => {
        const parrot = config.playerPets.find((entry) => entry?.name === 'Parrot');
        seenCopies.add(parrot?.parrotCopyPet);
        return { playerWins: 0, opponentWins: 0, draws: 1 };
      },
    });

    expect(seenCopies).toEqual(new Set(['Otter']));
  });
});
