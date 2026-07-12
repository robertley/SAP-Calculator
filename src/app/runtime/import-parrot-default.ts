export function defaultImportedParrotCopies(calculator: unknown): void {
  if (calculator === null || typeof calculator !== 'object' || Array.isArray(calculator)) {
    return;
  }

  const state = calculator as Record<string, unknown>;
  for (const teamKey of ['playerPets', 'opponentPets']) {
    const team = state[teamKey];
    if (!Array.isArray(team)) {
      continue;
    }

    for (let index = 0; index < team.length; index++) {
      const pet = team[index];
      if (!isImportedPet(pet) || pet.name !== 'Parrot' || pet.parrotCopyPet) {
        continue;
      }

      for (let frontIndex = index - 1; frontIndex >= 0; frontIndex--) {
        const petInFront = team[frontIndex];
        if (isImportedPet(petInFront) && typeof petInFront.name === 'string') {
          pet.parrotCopyPet = petInFront.name;
          break;
        }
      }
    }
  }
}

function isImportedPet(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
