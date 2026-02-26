import {
  CustomPackConfig,
  PetConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import {
  KEY_MAP,
  PACK_MAP,
  PERKS_BY_ID,
  PETS_BY_ID,
  PET_IDS_BY_NAME,
  PETS_META_BY_ID,
  TOYS_BY_ID,
} from './replay-calc-schema';
import {
  resolvePetIdFromUnknown,
  getTimesHurtFromRawPet,
  getTriggersConsumedFromRawPet,
  // other helpers available for future wiring
  resolveToyId,
  getToyName,
  buildRelicItems,
  buildAbominationMemory,
  inferAbominationAbilityEnumsFromSwallowedPets,
} from './replay-calc-parser-utils';

interface ReplayAbilityJson {
  Enu?: number | string | null;
  Lvl?: number | null;
  Grop?: number | null;
  TrCo?: number | null;
}

interface ReplayPetStatsJson {
  Temp?: number | null;
  Perm?: number | null;
}

interface ReplayPetJson {
  Enu?: number | string | null;
  At?: ReplayPetStatsJson | null;
  Hp?: ReplayPetStatsJson | null;
  Exp?: number | null;
  Lvl?: number | null;
  Perk?: number | string | null;
  Mana?: number | null;
  Pow?: {
    SabertoothTigerAbility?: number | null;
  } | null;
  Abil?: ReplayAbilityJson[] | null;
  Poi?: {
    x?: number | null;
  } | null;
  MiMs?: {
    Lsts?: {
      WhiteWhaleAbility?: ReplayPetJson[] | null;
    } | null;
  } | null;
  [key: string]: any;
}

interface ReplayToyJson {
  Enu?: number | string | null;
  Lvl?: number | null;
}

export interface ReplayDeckJson {
  Id?: number | string | null;
  Title?: string | null;
  Minions?: Array<number | string> | null;
  Spells?: Array<string | number> | null;
}

export interface ReplayBoardJson {
  [key: string]: unknown;
  Mins?: {
    Items?: Array<ReplayPetJson | null> | null;
  } | null;
  Rel?: {
    Items?: Array<ReplayToyJson | null> | null;
  } | null;
  Deck?: ReplayDeckJson | null;
  Pack?: number | null;
}

export interface ReplayBattleJson {
  UserBoard?: ReplayBoardJson | null;
  OpponentBoard?: ReplayBoardJson | null;
}

export interface ReplayBuildModelJson {
  [key: string]: unknown;
  Bor?: {
    Deck?: ReplayDeckJson | null;
  } | null;
}

export interface ReplayMetaBoards {
  userBoard?: ReplayBoardJson | null;
  opponentBoard?: ReplayBoardJson | null;
}

export interface ReplayParseOptions {
  abilityPetMap?: Record<string, string | number> | null;
}

export interface ReplayActionJson {
  Type?: number | null;
  Turn?: number | string | null;
  Build?: string | null;
  Battle?: string | null;
  Mode?: string | null;
}

export interface ReplayActionsContainerJson {
  Actions?: ReadonlyArray<ReplayActionJson> | null;
  GenesisBuildModel?: ReplayBuildModelJson | null;
}

export interface ReplayCustomPack extends CustomPackConfig {
  name: string;
  deckId?: string | null;
  tier1Pets: (string | null)[];
  tier2Pets: (string | null)[];
  tier3Pets: (string | null)[];
  tier4Pets: (string | null)[];
  tier5Pets: (string | null)[];
  tier6Pets: (string | null)[];
  spells: string[];
}

interface ReplayParsedToy {
  name: string | null;
  level: number;
}

type StrippedReplayPet = Pick<PetConfig, 'name'> & Partial<Omit<PetConfig, 'name'>>;

export interface ReplayCalculatorState {
  playerPack: string;
  opponentPack: string;
  playerToy: string | null;
  playerToyLevel: string;
  playerHardToy: null;
  playerHardToyLevel: number;
  opponentToy: string | null;
  opponentToyLevel: string;
  opponentHardToy: null;
  opponentHardToyLevel: number;
  turn: number;
  playerGoldSpent: number;
  opponentGoldSpent: number;
  playerRollAmount: number;
  opponentRollAmount: number;
  playerSummonedAmount: number;
  opponentSummonedAmount: number;
  playerLevel3Sold: number;
  opponentLevel3Sold: number;
  playerTransformationAmount: number;
  opponentTransformationAmount: number;
  playerPets: (PetConfig | null)[];
  opponentPets: (PetConfig | null)[];
  allPets: boolean;
  logFilter: string | null;
  customPacks: ReplayCustomPack[];
  oldStork: boolean;
  tokenPets: boolean;
  komodoShuffle: boolean;
  mana: boolean;
  seed: number | null;
  triggersConsumed: boolean;
  foodsEaten?: boolean;
  showAdvanced: boolean;
  showTriggerNamesInLogs: boolean;
  showPositionalArgsInLogs: boolean;
  ailmentEquipment: boolean;
}

type ReplayCustomPackCore = Omit<ReplayCustomPack, 'deckId'>;

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toNumberOrFallback(value: unknown, fallback: number): number {
  const parsed = toFiniteNumber(value);
  return parsed ?? fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const COPY_SOURCE_PET_IDS = new Set<string>([
  '53', // Parrot
  '373', // Abomination
]);

const ABOMINATION_SLOT_FIELDS = [
  {
    pet: 'abominationSwallowedPet1',
    level: 'abominationSwallowedPet1Level',
  },
  {
    pet: 'abominationSwallowedPet2',
    level: 'abominationSwallowedPet2Level',
  },
  {
    pet: 'abominationSwallowedPet3',
    level: 'abominationSwallowedPet3Level',
  },
] as const;

type AbilityOwnerCounts = Map<string, Map<string, number>>;

type AbominationSwallowedPetField = (typeof ABOMINATION_SLOT_FIELDS)[number]['pet'];
type AbominationSwallowedPetLevelField =
  (typeof ABOMINATION_SLOT_FIELDS)[number]['level'];

type AbominationSwallowedState = Pick<
  PetConfig,
  AbominationSwallowedPetField | AbominationSwallowedPetLevelField
>;

function toReplayId(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return null;
}

function incrementAbilityOwnerCount(
  abilityOwnerCounts: AbilityOwnerCounts,
  abilityId: string,
  petId: string,
): void {
  let petCountById = abilityOwnerCounts.get(abilityId);
  if (!petCountById) {
    petCountById = new Map<string, number>();
    abilityOwnerCounts.set(abilityId, petCountById);
  }
  petCountById.set(petId, (petCountById.get(petId) ?? 0) + 1);
}

function collectAbilityOwnerCounts(
  value: unknown,
  abilityOwnerCounts: AbilityOwnerCounts,
): void {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectAbilityOwnerCounts(entry, abilityOwnerCounts));
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  const petId = toReplayId(value.Enu);
  const abilities = value.Abil;
  if (petId && Array.isArray(abilities) && !COPY_SOURCE_PET_IDS.has(petId)) {
    abilities.forEach((ability) => {
      if (!isRecord(ability)) {
        return;
      }
      const abilityId = toReplayId(ability.Enu);
      if (!abilityId) {
        return;
      }
      incrementAbilityOwnerCount(abilityOwnerCounts, abilityId, petId);
    });
  }

  Object.values(value).forEach((entry) => {
    collectAbilityOwnerCounts(entry, abilityOwnerCounts);
  });
}

function pickMostLikelyPetId(petCountById: Map<string, number>): string | null {
  let bestPetId: string | null = null;
  let bestCount = -1;

  for (const [petId, count] of petCountById.entries()) {
    if (
      count > bestCount ||
      (count === bestCount && (bestPetId === null || petId < bestPetId))
    ) {
      bestPetId = petId;
      bestCount = count;
    }
  }

  return bestPetId;
}

function buildReplayAbilityPetMapFromCounts(
  abilityOwnerCounts: AbilityOwnerCounts,
): Record<string, string> {
  const abilityPetMap: Record<string, string> = {};
  for (const [abilityId, petCountById] of abilityOwnerCounts.entries()) {
    const petId = pickMostLikelyPetId(petCountById);
    if (petId) {
      abilityPetMap[abilityId] = petId;
    }
  }
  return abilityPetMap;
}

function parseJsonValue(raw: unknown): unknown {
  if (typeof raw !== 'string' || raw.length === 0) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function parseBattleAction(raw: unknown): ReplayBattleJson | null {
  const parsed = parseJsonValue(raw);
  if (!isRecord(parsed)) {
    return null;
  }
  return parsed as ReplayBattleJson;
}

export function selectReplayBattleFromActions(
  actions: ReadonlyArray<ReplayActionJson> | null | undefined,
  turnNumber: number,
): ReplayBattleJson | null {
  if (!Number.isFinite(turnNumber) || turnNumber <= 0) {
    return null;
  }

  const battleActions = (actions ?? []).filter(
    (action) =>
      Boolean(action?.Battle) &&
      (action?.Type === 0 || action?.Type === null || action?.Type === undefined),
  );

  const actionForTurn =
    battleActions.find((action) => Number(action?.Turn) === turnNumber) ??
    battleActions[turnNumber - 1] ??
    null;

  return parseBattleAction(actionForTurn?.Battle ?? null);
}

export function buildReplayAbilityPetMapFromActions(
  actions: ReadonlyArray<ReplayActionJson> | null | undefined,
): Record<string, string> {
  const abilityOwnerCounts: AbilityOwnerCounts = new Map();
  (actions ?? []).forEach((action) => {
    const parsedBuild = parseJsonValue(action?.Build);
    const parsedBattle = parseJsonValue(action?.Battle);
    const parsedMode = parseJsonValue(action?.Mode);
    collectAbilityOwnerCounts(parsedBuild, abilityOwnerCounts);
    collectAbilityOwnerCounts(parsedBattle, abilityOwnerCounts);
    collectAbilityOwnerCounts(parsedMode, abilityOwnerCounts);
  });
  return buildReplayAbilityPetMapFromCounts(abilityOwnerCounts);
}

export function parseReplayForCalculatorFromActions(
  actions: ReadonlyArray<ReplayActionJson> | null | undefined,
  turnNumber: number,
  buildModel?: ReplayBuildModelJson | null,
  metaBoards?: ReplayMetaBoards,
  options?: ReplayParseOptions,
): ReplayCalculatorState | null {
  const battleJson = selectReplayBattleFromActions(actions, turnNumber);
  if (!battleJson) {
    return null;
  }

  const inferredAbilityPetMap = buildReplayAbilityPetMapFromActions(actions);
  const mergedAbilityPetMap = {
    ...inferredAbilityPetMap,
    ...(options?.abilityPetMap ?? {}),
  };

  const parser = new ReplayCalcParser();
  return parser.parseReplayForCalculator(
    battleJson,
    buildModel ?? undefined,
    metaBoards,
    {
      ...options,
      abilityPetMap: mergedAbilityPetMap,
    },
  );
}

export function parseTeamwoodReplayForCalculator(
  replay: ReplayActionsContainerJson | null | undefined,
  turnNumber: number,
  metaBoards?: ReplayMetaBoards,
  options?: ReplayParseOptions,
): ReplayCalculatorState | null {
  return parseReplayForCalculatorFromActions(
    replay?.Actions,
    turnNumber,
    replay?.GenesisBuildModel ?? undefined,
    metaBoards,
    options,
  );
}

function defaultAbominationSwallowedState(): AbominationSwallowedState {
  return {
    abominationSwallowedPet1: null,
    abominationSwallowedPet2: null,
    abominationSwallowedPet3: null,
    abominationSwallowedPet1Level: 1,
    abominationSwallowedPet2Level: 1,
    abominationSwallowedPet3Level: 1,
  };
}

export class ReplayCalcParser {
  parseReplayForCalculator(
    battleJson: ReplayBattleJson,
    buildModel?: ReplayBuildModelJson,
    metaBoards?: ReplayMetaBoards,
    options?: ReplayParseOptions,
  ): ReplayCalculatorState {
    console.log(`[ReplayCalcParser] PETS_BY_ID size: ${PETS_BY_ID.size}`);
    const userBoard = battleJson?.UserBoard ?? metaBoards?.userBoard;
    const opponentBoard = battleJson?.OpponentBoard ?? metaBoards?.opponentBoard;

    const readBoardNumber = (
      board: ReplayBoardJson | null | undefined,
      key: string,
      fallback: number,
    ): number => {
      return toNumberOrFallback(board?.[key], fallback);
    };

    const abilityPetNameByAbilityId = new Map<string, string>();
    const abilityPetIdByAbilityId = new Map<string, string>();
    const applyAbilityPetMap = (
      abilityPetMap: Record<string, string | number> | null | undefined,
    ): void => {
      if (!abilityPetMap) {
        return;
      }
      Object.entries(abilityPetMap).forEach(([abilityIdRaw, petIdOrName]) => {
        const abilityId = toReplayId(abilityIdRaw);
        if (!abilityId) {
          return;
        }
        let mappedPetId =
          typeof petIdOrName === 'number' || typeof petIdOrName === 'string'
            ? String(petIdOrName)
            : null;

        // If the mapped pet id is numeric but not found in PETS_BY_ID,
        // try a legacy offset fallback (pet id - 30) which some backends
        // emit. This ensures ability->pet mappings using the -30 scheme
        // still resolve to known pet ids.
        if (mappedPetId && !PETS_BY_ID.has(mappedPetId)) {
          const asNum = Number(mappedPetId);
          if (Number.isInteger(asNum)) {
            const fallbackNum = asNum - 30;
            if (Number.isInteger(fallbackNum) && fallbackNum > 0) {
              const fallbackId = String(fallbackNum);
              if (PETS_BY_ID.has(fallbackId)) {
                mappedPetId = fallbackId;
              }
            }
          }
        }

        const mappedPetName =
          (mappedPetId ? PETS_BY_ID.get(mappedPetId) : null) ||
          (typeof petIdOrName === 'string' ? petIdOrName : null);

        if (mappedPetName) {
          abilityPetNameByAbilityId.set(abilityId, mappedPetName);
        }
        if (mappedPetId && PETS_BY_ID.has(mappedPetId)) {
          abilityPetIdByAbilityId.set(abilityId, mappedPetId);
        }
      });
    };

    const inferredAbilityOwnerCounts: AbilityOwnerCounts = new Map();
    collectAbilityOwnerCounts(battleJson, inferredAbilityOwnerCounts);
    collectAbilityOwnerCounts(buildModel, inferredAbilityOwnerCounts);
    collectAbilityOwnerCounts(metaBoards, inferredAbilityOwnerCounts);
    applyAbilityPetMap(
      buildReplayAbilityPetMapFromCounts(inferredAbilityOwnerCounts),
    );
    applyAbilityPetMap(options?.abilityPetMap ?? null);

    const resolveAbilityOwnerPetNameByNearbyMap = (
      abilityId: string,
    ): string | null => {
      const parsedAbilityId = Number(abilityId);
      if (!Number.isInteger(parsedAbilityId)) {
        return null;
      }

      const offsetCounts = new Map<number, number>();
      for (const [mappedAbilityId, mappedPetId] of abilityPetIdByAbilityId.entries()) {
        const parsedMappedAbilityId = Number(mappedAbilityId);
        const parsedMappedPetId = Number(mappedPetId);
        if (
          !Number.isInteger(parsedMappedAbilityId) ||
          !Number.isInteger(parsedMappedPetId)
        ) {
          continue;
        }

        const distance = Math.abs(parsedMappedAbilityId - parsedAbilityId);
        if (distance === 0 || distance > 2) {
          continue;
        }

        const offset = parsedMappedAbilityId - parsedMappedPetId;
        offsetCounts.set(offset, (offsetCounts.get(offset) ?? 0) + 1);
      }

      let bestOffset: number | null = null;
      let bestOffsetCount = 0;
      for (const [offset, count] of offsetCounts.entries()) {
        if (
          count > bestOffsetCount ||
          (count === bestOffsetCount &&
            (bestOffset === null || Math.abs(offset) < Math.abs(bestOffset)))
        ) {
          bestOffset = offset;
          bestOffsetCount = count;
        }
      }

      if (bestOffset === null) {
        return null;
      }

      const inferredPetId = String(parsedAbilityId - bestOffset);
      return PETS_BY_ID.get(inferredPetId) ?? null;
    };

    const resolveAbilityOwnerPetName = (abilityId: string): string | null => {
      return (
        abilityPetNameByAbilityId.get(abilityId) ??
        resolveAbilityOwnerPetNameByNearbyMap(abilityId)
      );
    };

    const getTimesHurt = (petJson: ReplayPetJson): number | null => {
      return getTimesHurtFromRawPet(petJson);
    };

    const parseAbominationSwallowedState = (
      petJson: ReplayPetJson,
    ): AbominationSwallowedState => {
      const abominationState = defaultAbominationSwallowedState();
      const copiedAbilities = (petJson?.Abil ?? [])
        .map((ability, index) => ({ ability, index }))
        .filter(
          (
            abilityEntry,
          ): abilityEntry is { ability: ReplayAbilityJson; index: number } =>
            abilityEntry.ability !== null &&
            toReplayId(abilityEntry.ability?.Enu) !== null,
        );

      if (copiedAbilities.length === 0) {
        return abominationState;
      }

      const groupedAbilities = new Map<
        number,
        { ability: ReplayAbilityJson; index: number }[]
      >();
      const orderedGroupKeys: number[] = [];
      copiedAbilities.forEach((abilityEntry) => {
        const groupKey = toFiniteNumber(abilityEntry.ability?.Grop) ?? 0;
        if (!groupedAbilities.has(groupKey)) {
          groupedAbilities.set(groupKey, []);
          orderedGroupKeys.push(groupKey);
        }
        groupedAbilities.get(groupKey)?.push(abilityEntry);
      });

      const usedAbilityIndexes = new Set<number>();
      const unresolvedSlotIndexes: number[] = [];

      ABOMINATION_SLOT_FIELDS.forEach((slotFields, slotIndex) => {
        const groupKey = orderedGroupKeys[slotIndex];
        if (groupKey === undefined) {
          unresolvedSlotIndexes.push(slotIndex);
          return;
        }
        const groupAbilities = groupedAbilities.get(groupKey);
        if (!groupAbilities || groupAbilities.length === 0) {
          unresolvedSlotIndexes.push(slotIndex);
          return;
        }

        let resolvedAbilityEntry:
          | { ability: ReplayAbilityJson; index: number }
          | null = null;
        let resolvedPetName: string | null = null;

        for (const abilityEntry of groupAbilities) {
          const abilityId = toReplayId(abilityEntry.ability?.Enu);
          if (!abilityId) {
            continue;
          }
          const ownerPetName = resolveAbilityOwnerPetName(abilityId);
          if (!ownerPetName) {
            continue;
          }
          resolvedAbilityEntry = abilityEntry;
          resolvedPetName = ownerPetName;
          break;
        }

        if (!resolvedAbilityEntry || !resolvedPetName) {
          unresolvedSlotIndexes.push(slotIndex);
          return;
        }

        abominationState[slotFields.pet] = resolvedPetName;
        const inferredLevel = toFiniteNumber(resolvedAbilityEntry.ability?.Lvl);
        if (inferredLevel !== null) {
          abominationState[slotFields.level] = inferredLevel;
        }
        usedAbilityIndexes.add(resolvedAbilityEntry.index);
      });

      if (unresolvedSlotIndexes.length === 0) {
        return abominationState;
      }

      const fallbackResolvedAbilities = copiedAbilities
        .filter((abilityEntry) => !usedAbilityIndexes.has(abilityEntry.index))
        .map((abilityEntry) => {
          const abilityId = toReplayId(abilityEntry.ability?.Enu);
          if (!abilityId) {
            return null;
          }
          const ownerPetName = resolveAbilityOwnerPetName(abilityId);
          if (!ownerPetName) {
            return null;
          }
          return {
            ownerPetName,
            level: toFiniteNumber(abilityEntry.ability?.Lvl),
          };
        })
        .filter(
          (
            abilityEntry,
          ): abilityEntry is { ownerPetName: string; level: number | null } =>
            abilityEntry !== null,
        );

      unresolvedSlotIndexes.forEach((slotIndex, fallbackIndex) => {
        const fallbackAbility = fallbackResolvedAbilities[fallbackIndex];
        if (!fallbackAbility) {
          return;
        }
        const slotFields = ABOMINATION_SLOT_FIELDS[slotIndex];
        abominationState[slotFields.pet] = fallbackAbility.ownerPetName;
        if (fallbackAbility.level !== null) {
          abominationState[slotFields.level] = fallbackAbility.level;
        }
      });

      return abominationState;
    };

    const parsePet = (petJson: ReplayPetJson | null | undefined): PetConfig | null => {
      if (!petJson) {
        return null;
      }

      // Build helper maps for more advanced inference (used for Abomination memory)
      const maps: any = { PET_IDS_BY_NAME };

      const rawPetRef = petJson.Enu ?? (petJson as any).enu ?? (petJson as any).Id ?? (petJson as any).id;
      const resolvedPetId = resolvePetIdFromUnknown(rawPetRef, maps);
      const petId = resolvedPetId !== null ? String(resolvedPetId) : String(rawPetRef ?? 0);

      const petName =
        PETS_BY_ID.get(petId) ||
        (petJson as any).name ||
        (petJson as any).Name ||
        (typeof rawPetRef === 'string' && rawPetRef.trim().length > 0
          ? rawPetRef.trim()
          : `Pet #${petId}`);

      console.log(`[ReplayCalcParser] Pet Enu:${rawPetRef} -> Id:${petId} -> Name:${petName}`);

      const atJson = petJson.At ?? (petJson as any).at;
      const hpJson = petJson.Hp ?? (petJson as any).hp;

      const petTempAtk = toNumberOrFallback(atJson?.Temp ?? (atJson as any)?.temp, 0);
      const petTempHp = toNumberOrFallback(hpJson?.Temp ?? (hpJson as any)?.temp, 0);

      let belugaSwallowedPet: string | null = null;
      if (petId === '182') {
        const swallowedPets = petJson?.MiMs?.Lsts?.WhiteWhaleAbility ?? [];
        if (swallowedPets.length > 0) {
          const swallowedPetId = swallowedPets[0]?.Enu;
          belugaSwallowedPet =
            PETS_BY_ID.get(String(swallowedPetId)) || `Pet #${swallowedPetId}`;
        }
      }
      const abominationSwallowedState =
        petId === '373'
          ? parseAbominationSwallowedState(petJson)
          : defaultAbominationSwallowedState();

      // abilityPetIdByAbilityId is a Map<abilityId, petId>
      // We invert it into abilityIdsByPetId: { [petId]: [abilityId, ...] }
      const abilityIdsByPetId: Record<string, string[]> = {};
      for (const [abilityId, mappedPetId] of abilityPetIdByAbilityId.entries()) {
        const pid = String(mappedPetId);
        abilityIdsByPetId[pid] = abilityIdsByPetId[pid] || [];
        abilityIdsByPetId[pid].push(String(abilityId));
      }
      maps.abilityIdsByPetId = abilityIdsByPetId;

      const timesHurt = getTimesHurt(petJson);
      const abilityTriggersConsumed = (() => {
        const v = getTriggersConsumedFromRawPet(petJson);
        return v === null ? [] : [v];
      })();

      const perkValue = petJson.Perk;
      const perkName =
        perkValue !== null && perkValue !== undefined
          ? PERKS_BY_ID.get(String(perkValue)) ||
          (typeof perkValue === 'string' ? perkValue : 'Unknown Perk')
          : null;

      const parsedPet: PetConfig = {
        name: petName,
        attack: toNumberOrFallback(atJson?.Perm ?? (atJson as any)?.perm ?? (petJson as any)?.attack, 0) + petTempAtk,
        health: toNumberOrFallback(hpJson?.Perm ?? (hpJson as any)?.perm ?? (petJson as any)?.health, 0) + petTempHp,
        exp: (() => {
          const exp = toFiniteNumber(petJson.Exp);
          if (exp !== null && exp > 0) {
            return exp;
          }
          const lvl = toFiniteNumber(petJson.Lvl);
          if (lvl === 2) {
            return 2;
          }
          if (lvl === 3) {
            return 5;
          }
          return exp ?? 0;
        })(),
        equipment: perkName ? { name: perkName } : null,
        mana: toNumberOrFallback(petJson.Mana, 0),
        belugaSwallowedPet,
        sarcasticFringeheadSwallowedPet: null,
        ...abominationSwallowedState,
        battlesFought: 0,
        triggersConsumed:
          abilityTriggersConsumed.length > 0
            ? Math.max(...abilityTriggersConsumed)
            : 0,
      };

      // If this is an Abomination, attempt to attach inferred memory/abilities
      if (String(petId) === '373') {
        try {
          const mem = buildAbominationMemory(petJson as any, Number(petId), maps);
          if (mem) {
            (parsedPet as any).abominationMemory = mem;
            const inferredEnums = inferAbominationAbilityEnumsFromSwallowedPets(petJson as any, maps);
            if (Array.isArray(inferredEnums) && inferredEnums.length > 0) {
              (parsedPet as any).abominationInferredAbilityEnums = inferredEnums;
            }
          }
        } catch (e) {
          /* best-effort only */
        }
      }
      if (timesHurt !== null) {
        parsedPet.timesHurt = timesHurt;
      }

      return parsedPet;
    };

    const parseBoardPets = (
      boardJson: ReplayBoardJson | null | undefined,
    ): (PetConfig | null)[] => {
      const items = boardJson?.Mins?.Items ?? [];
      const petArray: (PetConfig | null)[] = Array(5).fill(null);
      items.forEach((pet, index) => {
        if (!pet) {
          return;
        }
        let pos = toNumberOrFallback(pet.Poi?.x, -1);
        if (pos === -1) {
          pos = index;
        }
        if (pos >= 0 && pos < 5) {
          petArray[pos] = parsePet(pet);
        }
      });

      return petArray.reverse();
    };

    const getToy = (boardJson: ReplayBoardJson | null | undefined): ReplayParsedToy => {
      const toyItem = (boardJson?.Rel?.Items ?? []).find((item) => Boolean(item));
      if (toyItem) {
        const toyId = resolveToyId(toyItem as any) ?? null;
        const toyName = toyId ? TOYS_BY_ID.get(String(toyId)) : getToyName(toyItem as any);
        return {
          name: toyName || null,
          level: toNumberOrFallback((toyItem as any).Lvl, 1),
        };
      }
      return { name: null, level: 1 };
    };

    const playerToy = getToy(userBoard);
    const opponentToy = getToy(opponentBoard);

    const customPacks = this.buildCustomPacksFromGenesis(buildModel, battleJson);
    const playerCustomPack = this.findCustomPackFromDeck(
      customPacks,
      userBoard?.Deck,
    );
    const opponentCustomPack = this.findCustomPackFromDeck(
      customPacks,
      opponentBoard?.Deck,
    );
    const playerPackName =
      PACK_MAP[toNumberOrFallback(userBoard?.Pack, NaN)] ||
      playerCustomPack?.name ||
      'Turtle';
    const opponentPackName =
      PACK_MAP[toNumberOrFallback(opponentBoard?.Pack, NaN)] ||
      opponentCustomPack?.name ||
      'Turtle';

    return {
      playerPack: playerPackName,
      opponentPack: opponentPackName,
      playerToy: playerToy.name,
      playerToyLevel: String(playerToy.level),
      playerHardToy: null,
      playerHardToyLevel: 1,
      opponentToy: opponentToy.name,
      opponentToyLevel: String(opponentToy.level),
      opponentHardToy: null,
      opponentHardToyLevel: 1,
      turn: readBoardNumber(userBoard, 'Tur', 1) || 1,
      playerGoldSpent: readBoardNumber(userBoard, 'GoSp', 0) || 0,
      opponentGoldSpent: readBoardNumber(opponentBoard, 'GoSp', 0) || 0,
      playerRollAmount: readBoardNumber(userBoard, 'Rold', 0) || 0,
      opponentRollAmount: readBoardNumber(opponentBoard, 'Rold', 0) || 0,
      playerSummonedAmount: readBoardNumber(userBoard, 'MiSu', 0) || 0,
      opponentSummonedAmount: readBoardNumber(opponentBoard, 'MiSu', 0) || 0,
      playerLevel3Sold: readBoardNumber(userBoard, 'MSFL', 0) || 0,
      opponentLevel3Sold: readBoardNumber(opponentBoard, 'MSFL', 0) || 0,
      playerTransformationAmount: readBoardNumber(userBoard, 'TrTT', 0) || 0,
      opponentTransformationAmount: readBoardNumber(opponentBoard, 'TrTT', 0) || 0,
      playerPets: parseBoardPets(userBoard),
      opponentPets: parseBoardPets(opponentBoard),
      allPets: false,
      logFilter: null,
      customPacks,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: true,
      seed: null,
      triggersConsumed: true,
      showAdvanced: true,
      showTriggerNamesInLogs: false,
      showPositionalArgsInLogs: true,
      ailmentEquipment: false,
    };
  }

  buildCustomPacksFromGenesis(
    buildModel?: ReplayBuildModelJson,
    battleJson?: ReplayBattleJson,
  ): ReplayCustomPack[] {
    const decks = [
      buildModel?.Bor?.Deck,
      battleJson?.UserBoard?.Deck,
      battleJson?.OpponentBoard?.Deck,
    ].filter(
      (deck): deck is ReplayDeckJson =>
        deck !== null && deck !== undefined && Array.isArray(deck.Minions),
    );

    const packs: ReplayCustomPack[] = [];
    const seenDeckIds = new Set<string>();
    const usedNames = new Set<string>();

    for (const deck of decks) {
      const deckId = deck?.Id ? String(deck.Id) : null;
      if (deckId && seenDeckIds.has(deckId)) {
        continue;
      }
      if (deckId) {
        seenDeckIds.add(deckId);
      }
      const pack = this.buildCustomPackFromDeck(deck, usedNames);
      if (pack) {
        packs.push({ ...pack, deckId });
      }
    }

    return packs;
  }

  generateCalculatorLink(calculatorState: ReplayCalculatorState): string {
    const baseUrl = window.location.origin + window.location.pathname;
    const strippedState = this.stripDefaultValues(calculatorState);
    const truncatedState = this.truncateKeys(strippedState);
    const stateString = JSON.stringify(truncatedState);
    const base64Data = btoa(stateString);
    return `${baseUrl}#c=${base64Data}`;
  }

  private buildCustomPackFromDeck(
    deck: ReplayDeckJson | null | undefined,
    usedNames: Set<string>,
  ): ReplayCustomPackCore | null {
    if (!deck || !Array.isArray(deck.Minions)) {
      return null;
    }

    const minions = deck.Minions.map((id) => String(id));
    const spells = Array.isArray(deck.Spells) ? deck.Spells.map(String) : [];
    const tierPets: Record<number, string[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    for (const minionId of minions) {
      const petMeta = PETS_META_BY_ID.get(minionId);
      if (!petMeta) {
        continue;
      }
      if (tierPets[petMeta.tier]) {
        tierPets[petMeta.tier].push(petMeta.name);
      }
    }

    const normalizeTierPets = (pets: string[]): (string | null)[] => {
      const normalized = pets.slice(0, 10);
      while (normalized.length < 10) {
        normalized.push(null);
      }
      return normalized;
    };

    let deckName = deck.Title || 'Custom Pack';
    if (usedNames.has(deckName)) {
      let suffix = 2;
      while (usedNames.has(`${deckName} (${suffix})`)) {
        suffix += 1;
      }
      deckName = `${deckName} (${suffix})`;
    }
    usedNames.add(deckName);

    return {
      name: deckName,
      tier1Pets: normalizeTierPets(tierPets[1]),
      tier2Pets: normalizeTierPets(tierPets[2]),
      tier3Pets: normalizeTierPets(tierPets[3]),
      tier4Pets: normalizeTierPets(tierPets[4]),
      tier5Pets: normalizeTierPets(tierPets[5]),
      tier6Pets: normalizeTierPets(tierPets[6]),
      spells,
    };
  }

  private findCustomPackFromDeck(
    customPacks: ReplayCustomPack[],
    deck: ReplayDeckJson | null | undefined,
  ): ReplayCustomPack | null {
    if (!deck) {
      return null;
    }
    const deckId = deck?.Id ? String(deck.Id) : null;
    if (deckId) {
      const byId = customPacks.find((pack) => pack.deckId === deckId);
      if (byId) {
        return byId;
      }
    }
    const deckName = deck?.Title;
    if (deckName) {
      return customPacks.find((pack) => pack.name === deckName) || null;
    }
    return null;
  }

  private stripDefaultValues(
    state: ReplayCalculatorState,
  ): Record<string, unknown> {
    const strippedState: Record<string, unknown> = {};

    if (state.playerPack !== 'Turtle') {
      strippedState.playerPack = state.playerPack;
    }
    if (state.opponentPack !== 'Turtle') {
      strippedState.opponentPack = state.opponentPack;
    }
    if (state.playerToy) {
      strippedState.playerToy = state.playerToy;
    }
    if (state.playerToyLevel && state.playerToyLevel !== '1') {
      strippedState.playerToyLevel = state.playerToyLevel;
    }
    if (state.opponentToy) {
      strippedState.opponentToy = state.opponentToy;
    }
    if (state.opponentToyLevel && state.opponentToyLevel !== '1') {
      strippedState.opponentToyLevel = state.opponentToyLevel;
    }
    if (state.turn !== 11) {
      strippedState.turn = state.turn;
    }
    if (state.playerGoldSpent !== 10) {
      strippedState.playerGoldSpent = state.playerGoldSpent;
    }
    if (state.opponentGoldSpent !== 10) {
      strippedState.opponentGoldSpent = state.opponentGoldSpent;
    }
    if (state.playerRollAmount !== 4) {
      strippedState.playerRollAmount = state.playerRollAmount;
    }
    if (state.opponentRollAmount !== 4) {
      strippedState.opponentRollAmount = state.opponentRollAmount;
    }
    if (state.playerSummonedAmount !== 0) {
      strippedState.playerSummonedAmount = state.playerSummonedAmount;
    }
    if (state.opponentSummonedAmount !== 0) {
      strippedState.opponentSummonedAmount = state.opponentSummonedAmount;
    }
    if (state.playerLevel3Sold !== 0) {
      strippedState.playerLevel3Sold = state.playerLevel3Sold;
    }
    if (state.opponentLevel3Sold !== 0) {
      strippedState.opponentLevel3Sold = state.opponentLevel3Sold;
    }
    if (state.playerTransformationAmount !== 0) {
      strippedState.playerTransformationAmount = state.playerTransformationAmount;
    }
    if (state.opponentTransformationAmount !== 0) {
      strippedState.opponentTransformationAmount = state.opponentTransformationAmount;
    }

    if (state.allPets) {
      strippedState.allPets = true;
    }
    if (state.oldStork) {
      strippedState.oldStork = true;
    }
    if (state.tokenPets) {
      strippedState.tokenPets = true;
    }
    if (state.komodoShuffle) {
      strippedState.komodoShuffle = true;
    }
    if (state.mana) {
      strippedState.mana = true;
    }
    if (state.seed != null) {
      strippedState.seed = state.seed;
    }
    if (state.triggersConsumed) {
      strippedState.triggersConsumed = true;
    }
    if (state.foodsEaten) {
      strippedState.foodsEaten = true;
    }
    if (state.showAdvanced) {
      strippedState.showAdvanced = true;
    }
    if (state.showTriggerNamesInLogs) {
      strippedState.showTriggerNamesInLogs = true;
    }
    if (state.showPositionalArgsInLogs === false) {
      strippedState.showPositionalArgsInLogs = false;
    }
    if (state.ailmentEquipment) {
      strippedState.ailmentEquipment = true;
    }

    if (state.logFilter) {
      strippedState.logFilter = state.logFilter;
    }
    if (state.customPacks.length > 0) {
      strippedState.customPacks = state.customPacks;
    }

    const stripPetDefaults = (pet: PetConfig | null): StrippedReplayPet | null => {
      if (!pet || !pet.name) {
        return null;
      }

      const newPet: StrippedReplayPet = { name: pet.name };

      if (typeof pet.attack === 'number' && pet.attack !== 0) {
        newPet.attack = pet.attack;
      }
      if (typeof pet.health === 'number' && pet.health !== 0) {
        newPet.health = pet.health;
      }
      if (typeof pet.exp === 'number' && pet.exp !== 0) {
        newPet.exp = pet.exp;
      }
      if (typeof pet.mana === 'number' && pet.mana !== 0) {
        newPet.mana = pet.mana;
      }
      if (pet.equipment) {
        newPet.equipment = pet.equipment;
      }
      if (pet.triggersConsumed) {
        newPet.triggersConsumed = pet.triggersConsumed;
      }
      if (pet.foodsEaten) {
        newPet.foodsEaten = pet.foodsEaten;
      }
      if (pet.belugaSwallowedPet != null) {
        newPet.belugaSwallowedPet = pet.belugaSwallowedPet;
      }
      ABOMINATION_SLOT_FIELDS.forEach((slotFields) => {
        const swallowedPet = pet[slotFields.pet];
        if (swallowedPet != null) {
          newPet[slotFields.pet] = swallowedPet;
        }
        const swallowedLevel = pet[slotFields.level];
        if (typeof swallowedLevel === 'number' && swallowedLevel !== 1) {
          newPet[slotFields.level] = swallowedLevel;
        }
      });
      if (pet.timesHurt) {
        newPet.timesHurt = pet.timesHurt;
      }

      return newPet;
    };

    const strippedPlayerPets = state.playerPets.map(stripPetDefaults);
    if (strippedPlayerPets.some((pet) => pet !== null)) {
      strippedState.playerPets = strippedPlayerPets;
    }

    const strippedOpponentPets = state.opponentPets.map(stripPetDefaults);
    if (strippedOpponentPets.some((pet) => pet !== null)) {
      strippedState.opponentPets = strippedOpponentPets;
    }

    return strippedState;
  }

  private truncateKeys(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.truncateKeys(item));
    }
    if (isRecord(data)) {
      const newObj: Record<string, unknown> = {};
      for (const key of Object.keys(data)) {
        const newKey = KEY_MAP[key] || key;
        newObj[newKey] = this.truncateKeys(data[key]);
      }
      return newObj;
    }
    return data;
  }
}
