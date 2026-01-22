import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash-es';

export function buildApiResponse(
  playerWins: number,
  opponentWins: number,
  draws: number,
): string {
  return JSON.stringify(
    {
      playerWins,
      opponentWins,
      draws,
    },
    null,
  );
}

export function buildExportPayload(formGroup: FormGroup): string {
  return JSON.stringify(formGroup.value);
}

export function buildShareableLink(
  formGroup: FormGroup,
  baseUrl: string,
): string {
  const rawValue = formGroup.value;
  const cleanValue = cloneDeep(rawValue);

  const petsToClean = [
    ...(cleanValue.playerPets || []),
    ...(cleanValue.opponentPets || []),
  ];

  for (const pet of petsToClean) {
    if (pet) {
      delete pet.parent;
      delete pet.logService;
      delete pet.abilityService;
      delete pet.gameService;
      delete pet.petService;

      if (pet.equipment) {
        pet.equipment = { name: pet.equipment.name };
      }
    }
  }

  const calculatorStateString = JSON.stringify(cleanValue);
  const encodedData = encodeURIComponent(calculatorStateString);
  return `${baseUrl}?c=${encodedData}`;
}
