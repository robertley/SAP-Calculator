import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash-es';

const PARROT_ABOM_SWALLOWED_KEY = 'abomParrotSwallowed';

type ParrotAbomInner = [
  string | null,
  string | null,
  number | null,
  number | null,
];

type ParrotAbomSlot = [
  string | null,
  string | null,
  number | null,
  number | null,
  string | null,
  string | null,
  ParrotAbomInner[],
];

function forEachPet(state: any, cb: (pet: any) => void): void {
  if (!state || typeof state !== 'object') {
    return;
  }
  const pets = [
    ...(state.playerPets || []),
    ...(state.opponentPets || []),
  ];
  for (const pet of pets) {
    if (pet && typeof pet === 'object') {
      cb(pet);
    }
  }
}

function encodeParrotAbomSwallowed(pet: any): void {
  if (!pet || typeof pet !== 'object') {
    return;
  }
  if (Array.isArray(pet[PARROT_ABOM_SWALLOWED_KEY])) {
    return;
  }

  const slots: ParrotAbomSlot[] = [];
  for (let outer = 1; outer <= 3; outer++) {
    const base = `parrotCopyPetAbominationSwallowedPet${outer}`;
    const innerSlots: ParrotAbomInner[] = [];
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
      innerSlots.push([
        (pet[innerBase] ?? null) as string | null,
        (pet[`${innerBase}BelugaSwallowedPet`] ?? null) as string | null,
        (pet[`${innerBase}Level`] ?? null) as number | null,
        (pet[`${innerBase}TimesHurt`] ?? null) as number | null,
      ]);
      delete pet[innerBase];
      delete pet[`${innerBase}BelugaSwallowedPet`];
      delete pet[`${innerBase}Level`];
      delete pet[`${innerBase}TimesHurt`];
    }

    slots.push([
      (pet[base] ?? null) as string | null,
      (pet[`${base}BelugaSwallowedPet`] ?? null) as string | null,
      (pet[`${base}Level`] ?? null) as number | null,
      (pet[`${base}TimesHurt`] ?? null) as number | null,
      (pet[`${base}ParrotCopyPet`] ?? null) as string | null,
      (pet[`${base}ParrotCopyPetBelugaSwallowedPet`] ?? null) as string | null,
      innerSlots,
    ]);

    delete pet[base];
    delete pet[`${base}BelugaSwallowedPet`];
    delete pet[`${base}Level`];
    delete pet[`${base}TimesHurt`];
    delete pet[`${base}ParrotCopyPet`];
    delete pet[`${base}ParrotCopyPetBelugaSwallowedPet`];
  }

  pet[PARROT_ABOM_SWALLOWED_KEY] = slots;
}

function decodeParrotAbomSwallowed(pet: any): void {
  if (!pet || typeof pet !== 'object') {
    return;
  }
  const slots = pet[PARROT_ABOM_SWALLOWED_KEY];
  if (!Array.isArray(slots)) {
    return;
  }

  for (let outer = 1; outer <= 3; outer++) {
    const base = `parrotCopyPetAbominationSwallowedPet${outer}`;
    const slot = slots[outer - 1] as ParrotAbomSlot | undefined;
    if (!slot) {
      continue;
    }
    const [
      petName,
      beluga,
      level,
      timesHurt,
      parrotCopyPet,
      parrotCopyBeluga,
      innerSlots,
    ] = slot;

    pet[base] = petName ?? null;
    pet[`${base}BelugaSwallowedPet`] = beluga ?? null;
    pet[`${base}Level`] = level ?? null;
    pet[`${base}TimesHurt`] = timesHurt ?? null;
    pet[`${base}ParrotCopyPet`] = parrotCopyPet ?? null;
    pet[`${base}ParrotCopyPetBelugaSwallowedPet`] = parrotCopyBeluga ?? null;

    if (Array.isArray(innerSlots)) {
      for (let inner = 1; inner <= 3; inner++) {
        const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
        const innerSlot = innerSlots[inner - 1] as
          | ParrotAbomInner
          | undefined;
        if (!innerSlot) {
          continue;
        }
        const [innerPet, innerBeluga, innerLevel, innerTimesHurt] = innerSlot;
        pet[innerBase] = innerPet ?? null;
        pet[`${innerBase}BelugaSwallowedPet`] = innerBeluga ?? null;
        pet[`${innerBase}Level`] = innerLevel ?? null;
        pet[`${innerBase}TimesHurt`] = innerTimesHurt ?? null;
      }
    }
  }

  delete pet[PARROT_ABOM_SWALLOWED_KEY];
}

export function compactCalculatorState(state: any): any {
  const clean = cloneDeep(state);
  forEachPet(clean, encodeParrotAbomSwallowed);
  return clean;
}

export function expandCompactCalculatorState(state: any): any {
  if (!state || typeof state !== 'object') {
    return state;
  }
  forEachPet(state, decodeParrotAbomSwallowed);
  return state;
}

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
  const compactValue = compactCalculatorState(formGroup.value);
  return JSON.stringify(compactValue);
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
        const equipmentName =
          typeof pet.equipment === 'string'
            ? pet.equipment
            : pet.equipment.name;
        pet.equipment = equipmentName ? { name: equipmentName } : null;
      }
    }
  }

  const compactValue = compactCalculatorState(cleanValue);
  const calculatorStateString = JSON.stringify(compactValue);
  const encodedData = encodeURIComponent(calculatorStateString);
  return `${baseUrl}?c=${encodedData}`;
}
