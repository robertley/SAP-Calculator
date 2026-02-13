import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash-es';
import { KEY_MAP, REVERSE_KEY_MAP } from 'app/runtime/state/url-state-key-map';

const PARROT_ABOM_SWALLOWED_KEY = 'abomParrotSwallowed';
const EXPORT_TOKEN_PREFIX = 'SAPC1:';

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

type RecordShape = Record<string, unknown>;

const SHARE_DEFAULTS: RecordShape = {
  playerPack: 'Turtle',
  opponentPack: 'Turtle',
  playerToy: null,
  playerToyLevel: 1,
  playerHardToy: null,
  playerHardToyLevel: 1,
  opponentToy: null,
  opponentToyLevel: 1,
  opponentHardToy: null,
  opponentHardToyLevel: 1,
  turn: 11,
  playerGoldSpent: 10,
  opponentGoldSpent: 10,
  playerRollAmount: 4,
  opponentRollAmount: 4,
  playerSummonedAmount: 0,
  opponentSummonedAmount: 0,
  playerTransformationAmount: 0,
  opponentTransformationAmount: 0,
  playerLevel3Sold: 0,
  opponentLevel3Sold: 0,
  playerPets: [null, null, null, null, null],
  opponentPets: [null, null, null, null, null],
  allPets: false,
  logFilter: null,
  customPacks: [],
  oldStork: false,
  tokenPets: true,
  komodoShuffle: false,
  mana: false,
  seed: null,
  triggersConsumed: false,
  showAdvanced: false,
  showTriggerNamesInLogs: false,
  showSwallowedLevels: false,
  ailmentEquipment: false,
  changeEquipmentUses: false,
  logsEnabled: true,
  simulations: 100,
};

function isRecord(value: unknown): value is RecordShape {
  return typeof value === 'object' && value !== null;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!valuesEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}

function stripTopLevelDefaults(state: RecordShape): void {
  for (const key of Object.keys(SHARE_DEFAULTS)) {
    if (!(key in state)) {
      continue;
    }
    if (valuesEqual(state[key], SHARE_DEFAULTS[key])) {
      delete state[key];
    }
  }
}

function truncateKeys(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => truncateKeys(item));
  }
  if (isRecord(data)) {
    const newObj: RecordShape = {};
    for (const key of Object.keys(data)) {
      const newKey = KEY_MAP[key] || key;
      newObj[newKey] = truncateKeys(data[key]);
    }
    return newObj;
  }
  return data;
}

function expandKeys(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => expandKeys(item));
  }
  if (isRecord(data)) {
    const newObj: RecordShape = {};
    for (const key of Object.keys(data)) {
      const newKey = REVERSE_KEY_MAP[key] || key;
      newObj[newKey] = expandKeys(data[key]);
    }
    return newObj;
  }
  return data;
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = `${base64}${'='.repeat(padLength)}`;
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function forEachPet(state: unknown, cb: (pet: RecordShape) => void): void {
  if (!isRecord(state)) {
    return;
  }
  const playerPets = Array.isArray(state.playerPets) ? state.playerPets : [];
  const opponentPets = Array.isArray(state.opponentPets)
    ? state.opponentPets
    : [];
  const pets = [
    ...playerPets,
    ...opponentPets,
  ];
  for (const pet of pets) {
    if (isRecord(pet)) {
      cb(pet);
    }
  }
}

function isEmptyParrotAbomInner(slot: ParrotAbomInner | undefined): boolean {
  if (!slot) {
    return true;
  }
  return (
    slot[0] == null &&
    slot[1] == null &&
    slot[2] == null &&
    slot[3] == null
  );
}

function isEmptyParrotAbomSlot(slot: ParrotAbomSlot | undefined): boolean {
  if (!slot) {
    return true;
  }
  const innerSlots = Array.isArray(slot[6]) ? slot[6] : [];
  return (
    slot[0] == null &&
    slot[1] == null &&
    slot[2] == null &&
    slot[3] == null &&
    slot[4] == null &&
    slot[5] == null &&
    innerSlots.every((innerSlot) => isEmptyParrotAbomInner(innerSlot))
  );
}

function trimTrailingEmptyInnerSlots(innerSlots: ParrotAbomInner[]): ParrotAbomInner[] {
  let end = innerSlots.length;
  while (end > 0 && isEmptyParrotAbomInner(innerSlots[end - 1])) {
    end -= 1;
  }
  return end === innerSlots.length ? innerSlots : innerSlots.slice(0, end);
}

function trimTrailingEmptyOuterSlots(slots: ParrotAbomSlot[]): ParrotAbomSlot[] {
  let end = slots.length;
  while (end > 0 && isEmptyParrotAbomSlot(slots[end - 1])) {
    end -= 1;
  }
  return end === slots.length ? slots : slots.slice(0, end);
}

function encodeParrotAbomSwallowed(pet: RecordShape): void {
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
    const trimmedInnerSlots = trimTrailingEmptyInnerSlots(innerSlots);

    slots.push([
      (pet[base] ?? null) as string | null,
      (pet[`${base}BelugaSwallowedPet`] ?? null) as string | null,
      (pet[`${base}Level`] ?? null) as number | null,
      (pet[`${base}TimesHurt`] ?? null) as number | null,
      (pet[`${base}ParrotCopyPet`] ?? null) as string | null,
      (pet[`${base}ParrotCopyPetBelugaSwallowedPet`] ?? null) as string | null,
      trimmedInnerSlots,
    ]);

    delete pet[base];
    delete pet[`${base}BelugaSwallowedPet`];
    delete pet[`${base}Level`];
    delete pet[`${base}TimesHurt`];
    delete pet[`${base}ParrotCopyPet`];
    delete pet[`${base}ParrotCopyPetBelugaSwallowedPet`];
  }

  const trimmedSlots = trimTrailingEmptyOuterSlots(slots);
  if (trimmedSlots.length > 0) {
    pet[PARROT_ABOM_SWALLOWED_KEY] = trimmedSlots;
  }
}

function cleanPetForShare(rawPet: unknown): RecordShape | null {
  if (!isRecord(rawPet)) {
    return null;
  }

  const petName = rawPet.name;
  if (typeof petName !== 'string' || petName.trim().length === 0) {
    return null;
  }

  delete rawPet.parent;
  delete rawPet.logService;
  delete rawPet.abilityService;
  delete rawPet.gameService;
  delete rawPet.petService;

  if (rawPet.equipment) {
    const equipmentName =
      typeof rawPet.equipment === 'string'
        ? rawPet.equipment
        : isRecord(rawPet.equipment) && typeof rawPet.equipment.name === 'string'
          ? rawPet.equipment.name
          : null;
    rawPet.equipment = equipmentName ? { name: equipmentName } : null;
  }

  for (const key of Object.keys(rawPet)) {
    if (key === 'name') {
      continue;
    }
    const value = rawPet[key];
    if (
      value == null ||
      value === false ||
      value === '' ||
      (typeof value === 'number' && value === 0) ||
      (key.endsWith('Level') && value === 1) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete rawPet[key];
    }
  }

  return rawPet;
}

function decodeParrotAbomSwallowed(pet: RecordShape): void {
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

export function compactCalculatorState(state: unknown): unknown {
  const clean = cloneDeep(state);
  forEachPet(clean, encodeParrotAbomSwallowed);
  return clean;
}

export function expandCompactCalculatorState(state: unknown): unknown {
  if (!isRecord(state)) {
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

function buildCompressedStateToken(rawValue: unknown): string {
  const cleanValue = cloneDeep(rawValue) as RecordShape;
  const playerPets = Array.isArray(cleanValue.playerPets)
    ? cleanValue.playerPets
    : [];
  const opponentPets = Array.isArray(cleanValue.opponentPets)
    ? cleanValue.opponentPets
    : [];
  cleanValue.playerPets = playerPets.map((pet) => cleanPetForShare(pet));
  cleanValue.opponentPets = opponentPets.map((pet) => cleanPetForShare(pet));
  stripTopLevelDefaults(cleanValue);

  const compactValue = compactCalculatorState(cleanValue);
  const truncatedValue = truncateKeys(compactValue);
  const calculatorStateString = JSON.stringify(truncatedValue);
  return `${EXPORT_TOKEN_PREFIX}${toBase64Url(calculatorStateString)}`;
}

export function buildExportPayload(formGroup: FormGroup): string {
  return buildCompressedStateToken(formGroup.value);
}

export function parseImportPayload(payload: string): unknown {
  const raw = payload.trim();
  if (!raw) {
    throw new Error('Import payload is empty.');
  }

  if (raw.startsWith(EXPORT_TOKEN_PREFIX)) {
    const encoded = raw.slice(EXPORT_TOKEN_PREFIX.length);
    const parsedCompressed = JSON.parse(fromBase64Url(encoded)) as unknown;
    return expandKeys(parsedCompressed);
  }

  return JSON.parse(raw) as unknown;
}

export function buildShareableLink(
  formGroup: FormGroup,
  baseUrl: string,
): string {
  const encodedData = buildCompressedStateToken(formGroup.value).slice(
    EXPORT_TOKEN_PREFIX.length,
  );
  return `${baseUrl}#c=${encodedData}`;
}
