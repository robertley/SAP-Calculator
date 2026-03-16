import { FormGroup } from '@angular/forms';
import { SimulationConfig, CustomPackConfig } from 'app/domain/interfaces/simulation-config.interface';
import { GameService } from './game.service';

export type GameApiFormControlName =
  | 'playerHardToy'
  | 'playerHardToyLevel'
  | 'opponentHardToy'
  | 'opponentHardToyLevel'
  | 'oldStork'
  | 'komodoShuffle'
  | 'mana'
  | 'playerRollAmount'
  | 'opponentRollAmount'
  | 'playerLevel3Sold'
  | 'opponentLevel3Sold'
  | 'playerSummonedAmount'
  | 'opponentSummonedAmount'
  | 'playerTransformationAmount'
  | 'opponentTransformationAmount';

const GAME_API_CONTROL_APPLIERS: Record<
  GameApiFormControlName,
  (gameService: GameService, value: unknown) => void
> = {
  playerHardToy: (gameService, value) => {
    gameService.gameApi.playerHardToy =
      typeof value === 'string' ? value : null;
  },
  playerHardToyLevel: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.playerHardToyLevel = numericValue;
    }
  },
  opponentHardToy: (gameService, value) => {
    gameService.gameApi.opponentHardToy =
      typeof value === 'string' ? value : null;
  },
  opponentHardToyLevel: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.opponentHardToyLevel = numericValue;
    }
  },
  oldStork: (gameService, value) => {
    gameService.gameApi.oldStork = value === true;
  },
  komodoShuffle: (gameService, value) => {
    gameService.gameApi.komodoShuffle = value === true;
  },
  mana: (gameService, value) => {
    gameService.gameApi.mana = value === true;
  },
  playerRollAmount: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.playerRollAmount = numericValue;
    }
  },
  opponentRollAmount: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.opponentRollAmount = numericValue;
    }
  },
  playerLevel3Sold: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.playerLevel3Sold = numericValue;
    }
  },
  opponentLevel3Sold: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.opponentLevel3Sold = numericValue;
    }
  },
  playerSummonedAmount: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.playerSummonedAmount = numericValue;
    }
  },
  opponentSummonedAmount: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.opponentSummonedAmount = numericValue;
    }
  },
  playerTransformationAmount: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.playerTransformationAmount = numericValue;
    }
  },
  opponentTransformationAmount: (gameService, value) => {
    const numericValue = toNullableNumber(value);
    if (numericValue != null) {
      gameService.gameApi.opponentTransformationAmount = numericValue;
    }
  },
};

const GAME_API_CONTROL_NAMES = Object.keys(
  GAME_API_CONTROL_APPLIERS,
) as GameApiFormControlName[];

export function applyGameApiFormControlValue(
  gameService: GameService,
  controlName: GameApiFormControlName,
  value: unknown,
): void {
  GAME_API_CONTROL_APPLIERS[controlName](gameService, value);
}

export function syncGameApiFromForm(
  gameService: GameService,
  formGroup: FormGroup,
  options?: { dayNight?: boolean | null },
): void {
  for (const controlName of GAME_API_CONTROL_NAMES) {
    applyGameApiFormControlValue(
      gameService,
      controlName,
      formGroup.get(controlName)?.value,
    );
  }

  gameService.setGoldSpent(
    toNullableNumber(formGroup.get('playerGoldSpent')?.value),
    toNullableNumber(formGroup.get('opponentGoldSpent')?.value),
  );
  gameService.setTurnNumber(toNullableNumber(formGroup.get('turn')?.value) ?? 0);

  if (options?.dayNight != null) {
    gameService.gameApi.day = options.dayNight;
  }
}

export function buildSimulationConfigFromForm(
  formGroup: FormGroup,
  count: number,
  options: { maxLoggedBattles: number },
  configOverrides?: Partial<SimulationConfig>,
): SimulationConfig {
  const logsEnabled = formGroup.get('logsEnabled')?.value ?? true;
  const seed = normalizeSeed(formGroup.get('seed')?.value);

  return {
    playerPack: `${formGroup.get('playerPack')?.value ?? ''}`,
    opponentPack: `${formGroup.get('opponentPack')?.value ?? ''}`,
    playerToy: normalizeNullableString(formGroup.get('playerToy')?.value),
    playerToyLevel: toNullableNumber(formGroup.get('playerToyLevel')?.value) ?? 1,
    playerHardToy: normalizeNullableString(formGroup.get('playerHardToy')?.value),
    playerHardToyLevel:
      toNullableNumber(formGroup.get('playerHardToyLevel')?.value) ?? 1,
    opponentToy: normalizeNullableString(formGroup.get('opponentToy')?.value),
    opponentToyLevel:
      toNullableNumber(formGroup.get('opponentToyLevel')?.value) ?? 1,
    opponentHardToy: normalizeNullableString(
      formGroup.get('opponentHardToy')?.value,
    ),
    opponentHardToyLevel:
      toNullableNumber(formGroup.get('opponentHardToyLevel')?.value) ?? 1,
    turn: toNullableNumber(formGroup.get('turn')?.value) ?? 1,
    playerGoldSpent: toNullableNumber(formGroup.get('playerGoldSpent')?.value),
    opponentGoldSpent: toNullableNumber(
      formGroup.get('opponentGoldSpent')?.value,
    ),
    playerRollAmount: toNullableNumber(formGroup.get('playerRollAmount')?.value),
    opponentRollAmount: toNullableNumber(
      formGroup.get('opponentRollAmount')?.value,
    ),
    playerSummonedAmount: toNullableNumber(
      formGroup.get('playerSummonedAmount')?.value,
    ),
    opponentSummonedAmount: toNullableNumber(
      formGroup.get('opponentSummonedAmount')?.value,
    ),
    playerLevel3Sold: toNullableNumber(formGroup.get('playerLevel3Sold')?.value),
    opponentLevel3Sold: toNullableNumber(
      formGroup.get('opponentLevel3Sold')?.value,
    ),
    playerTransformationAmount: toNullableNumber(
      formGroup.get('playerTransformationAmount')?.value,
    ),
    opponentTransformationAmount: toNullableNumber(
      formGroup.get('opponentTransformationAmount')?.value,
    ),
    playerPets: normalizePetList(formGroup.get('playerPets')?.value),
    opponentPets: normalizePetList(formGroup.get('opponentPets')?.value),
    customPacks: normalizeCustomPacks(formGroup.get('customPacks')?.value),
    allPets: formGroup.get('allPets')?.value === true,
    oldStork: formGroup.get('oldStork')?.value === true,
    tokenPets: formGroup.get('tokenPets')?.value === true,
    komodoShuffle: formGroup.get('komodoShuffle')?.value === true,
    mana: formGroup.get('mana')?.value === true,
    seed,
    simulationCount: count,
    logsEnabled,
    maxLoggedBattles: options.maxLoggedBattles,
    ...configOverrides,
  };
}

function normalizeCustomPacks(customPacks: unknown): CustomPackConfig[] {
  if (!Array.isArray(customPacks)) {
    return [];
  }

  return customPacks
    .map((customPack) => normalizeCustomPack(customPack))
    .filter((customPack): customPack is CustomPackConfig => customPack !== null);
}

function normalizeCustomPack(customPack: unknown): CustomPackConfig | null {
  if (!isRecord(customPack)) {
    return null;
  }

  const name = `${customPack.name ?? ''}`.trim();
  if (!name) {
    return null;
  }

  return {
    name,
    tier1Pets: normalizeStringList(customPack.tier1Pets),
    tier2Pets: normalizeStringList(customPack.tier2Pets),
    tier3Pets: normalizeStringList(customPack.tier3Pets),
    tier4Pets: normalizeStringList(customPack.tier4Pets),
    tier5Pets: normalizeStringList(customPack.tier5Pets),
    tier6Pets: normalizeStringList(customPack.tier6Pets),
    spells: normalizeStringList(customPack.spells),
  };
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function normalizePetList(
  pets: unknown,
): (SimulationConfig['playerPets'][number] | null)[] {
  if (!Array.isArray(pets)) {
    return [];
  }

  return pets.map((pet) => normalizePetEntry(pet));
}

function normalizePetEntry(
  pet: unknown,
): SimulationConfig['playerPets'][number] | null {
  if (!isRecord(pet) || typeof pet.name !== 'string' || !pet.name) {
    return null;
  }

  const normalized: Record<string, unknown> = { ...pet };
  const rawEquipment = normalized.equipment;
  let equipmentName: string | null = null;
  let equipmentUses: number | null =
    typeof normalized.equipmentUses === 'number'
      ? normalized.equipmentUses
      : null;

  if (isRecord(rawEquipment)) {
    equipmentName =
      typeof rawEquipment.name === 'string' ? rawEquipment.name : null;
    if (equipmentUses == null && rawEquipment.uses != null) {
      const usesValue = Number(rawEquipment.uses);
      equipmentUses = Number.isFinite(usesValue) ? usesValue : null;
    }
  } else if (typeof rawEquipment === 'string') {
    equipmentName = rawEquipment;
  }

  normalized.equipment = equipmentName ? { name: equipmentName } : null;
  normalized.equipmentUses = equipmentUses ?? null;

  delete normalized.parent;
  delete normalized.logService;
  delete normalized.abilityService;
  delete normalized.gameService;
  delete normalized.petService;
  delete normalized.abilityList;
  delete normalized.originalAbilityList;
  delete normalized.originalEquipment;

  return normalized as unknown as SimulationConfig['playerPets'][number];
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function normalizeSeed(value: unknown): number | null {
  const parsedSeed = Number(value);
  return value === '' || value == null || !Number.isFinite(parsedSeed)
    ? null
    : Math.trunc(parsedSeed);
}

function toNullableNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
