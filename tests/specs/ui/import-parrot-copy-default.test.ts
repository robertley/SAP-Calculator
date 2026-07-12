import { describe, expect, it } from 'vitest';
import { defaultImportedParrotCopies } from 'app/runtime/import-parrot-default';

describe('imported Parrot copy defaults', () => {
  it('copies the nearest occupied pet in front on both teams', () => {
    const state = {
      playerPets: [
        { name: 'Ant' },
        null,
        { name: 'Parrot', parrotCopyPet: null },
      ],
      opponentPets: [
        { name: 'Fish' },
        { name: 'Parrot' },
      ],
    };

    defaultImportedParrotCopies(state);

    expect(state.playerPets[2]?.parrotCopyPet).toBe('Ant');
    expect(state.opponentPets[1].parrotCopyPet).toBe('Fish');
  });

  it('preserves an imported saved copy', () => {
    const state = {
      playerPets: [
        { name: 'Ant' },
        { name: 'Parrot', parrotCopyPet: 'Otter' },
      ],
    };

    defaultImportedParrotCopies(state);

    expect(state.playerPets[1].parrotCopyPet).toBe('Otter');
  });
});
