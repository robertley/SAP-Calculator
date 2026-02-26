/* Utilities ported/adapted from replay parity fixes PR.
   Purpose: robust pet/toy id resolution, ability fallbacks, abomination
   swallowed-pet inference, and small helpers used by the replay parser.
*/

type ReplayUnknownRecord = Record<string, unknown>;
type ReplayNameLookup =
  | Map<string, string | number>
  | Record<string, string | number | undefined>;

export interface ReplayParserLookupMaps {
  petIdsByName?: ReplayNameLookup;
  PET_IDS_BY_NAME?: ReplayNameLookup;
  abilityIdsByPetId?: Record<string, Array<string | number> | undefined>;
  toyIdsByName?: Record<string, string | number | undefined>;
}

interface ReplayMemoryPayload {
  Lsts: Record<string, ReplayUnknownRecord[]>;
}

interface ReplayMemoryEntry extends ReplayUnknownRecord {
  Enu: number;
  At?: number;
  Hp?: number;
  Mana?: number | null;
  Lvl?: number;
  Exp?: number | null;
  Perk?: number | null;
  Powa?: number | null;
  MiMs?: ReplayMemoryPayload;
}

interface AbominationSlotConfig {
  petKey: string;
  levelKey: string;
  belugaKey: string;
  sfsKey: string;
}

interface AbominationSwallowedEntry {
  swallowedPetId: number;
  swallowedAbilityEnums: number[];
  memoryEntry: ReplayMemoryEntry;
  belugaSwallowedEntry?: ReplayMemoryPayload | null;
}

interface ReplayWarningBag {
  unknownToys: string[];
}

interface ReplayAbilityEntry {
  Enu: number;
  Lvl: number;
  Nat: boolean;
  Dur: number;
  TrCo: number;
  Char: null;
  Dis: boolean;
  AIML: boolean;
}

interface ReplayRelicItem {
  Own: number;
  Enu: number;
  Loc: number;
  Poi: { x: number; y: number };
  Exp: number;
  Lvl: number;
  Hp: { Perm: number; Temp: number; Max: number | null };
  At: { Perm: number; Temp: number; Max: number | null };
  Mana: number;
  Cou: number;
  PeBo: boolean;
  PeDu: null;
  PeDM: null;
  PeMu: null;
  PeDr: number;
  Abil: ReplayAbilityEntry[];
  AbDi: boolean;
  Cosm: number;
  Dead: boolean;
  Dest: boolean;
  DeBy: null;
  Link: null;
  Pow: null;
  SeV: null;
  Rwds: number;
  Rwrd: boolean;
  MiMs: null;
  SpMe: null;
  Tri: null;
  AtkC: number;
  HrtC: number;
  SpCT: number;
  OlTs: null;
  LastTargetsThisTurn: null;
  Id: { BoId: string; Uni: number };
  Pri: number;
  Fro: boolean;
  WFro: boolean;
  AFro: boolean;
}

export const FALLBACK_ABILITY_IDS_BY_PET_ID: Record<string, number[]> = {
  '338': [368],
  '373': [403],
  '635': [669],
  // Sarcastic Fringehead observed multiple ability enums in payloads
  '763': [853, 970],
};

export const FALLBACK_TOY_IDS_BY_NAME: Record<string, number> = {
  actionfigure: 294,
  airpalmtree: 511,
  balloon: 479,
  boot: 299,
  bowlingball: 300,
  brokenpiggybank: 310,
  broom: 301,
  cardboardbox: 302,
  // (trimmed list - include common fallbacks used in live payloads)
  television: 491,
  toymouse: 327,
};

function isPlainObject(value: unknown): value is ReplayUnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRecord(value: unknown): ReplayUnknownRecord | null {
  return isPlainObject(value) ? value : null;
}

function getByNameLookup(
  lookup: ReplayNameLookup | undefined,
  key: string,
): string | number | undefined {
  if (!lookup) {
    return undefined;
  }
  if (lookup instanceof Map) {
    return lookup.get(key);
  }
  return lookup[key];
}

function toIntOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toNullableNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function toFiniteNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function resolvePetIdFromUnknown(
  value: unknown,
  maps?: ReplayParserLookupMaps,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (isPlainObject(value)) {
    const directIdCandidates = [
      value['id'],
      value['Id'],
      value['petId'],
      value['PetId'],
      value['enum'],
      value['Enum'],
      value['Enu'],
      value['enu'],
    ];
    for (const candidate of directIdCandidates) {
      if (candidate === undefined || candidate === null) {
        continue;
      }
      const numeric = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(numeric)) {
        return Math.trunc(numeric);
      }
    }

    const nameRaw = value['name'] ?? value['Name'];
    if (typeof nameRaw === 'string') {
      const key = nameRaw.toLowerCase().replace(/[^a-z0-9]/g, '');
      const petIdsByName = maps?.petIdsByName ?? maps?.PET_IDS_BY_NAME;
      const id = getByNameLookup(petIdsByName, key);
      const numeric = toIntOrNull(id);
      if (numeric !== null) {
        return numeric;
      }
    }
    return null;
  }

  if (typeof value === 'string') {
    const s = value.trim();
    if (s === '') {
      return null;
    }
    const numeric = toFiniteNumber(s, NaN);
    if (Number.isFinite(numeric)) {
      return Math.trunc(numeric);
    }
    const key = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const petIdsByName = maps?.petIdsByName ?? maps?.PET_IDS_BY_NAME;
    const id = getByNameLookup(petIdsByName, key);
    const mapped = toIntOrNull(id);
    if (mapped !== null) {
      return mapped;
    }
    return null;
  }

  const numeric = toFiniteNumber(value, NaN);
  if (Number.isFinite(numeric)) {
    return Math.trunc(numeric);
  }
  return null;
}

export function uniqueNumbers(values: unknown[]): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  for (const v of values) {
    if (v === null || v === undefined) {
      continue;
    }
    const n = Number(v);
    if (!Number.isFinite(n)) {
      continue;
    }
    const normalized = Math.trunc(n);
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

export function getAbilityEnumsForPet(
  petId: number,
  maps?: ReplayParserLookupMaps,
): number[] {
  const abilityMap = maps?.abilityIdsByPetId ?? {};
  const key = String(petId);
  const mapped = Array.isArray(abilityMap[key]) ? abilityMap[key] ?? [] : [];
  const fallback = Array.isArray(FALLBACK_ABILITY_IDS_BY_PET_ID[key])
    ? FALLBACK_ABILITY_IDS_BY_PET_ID[key]
    : [];
  return uniqueNumbers([...mapped, ...fallback]);
}

function buildBelugaSwallowedEntry(swallowedRaw: unknown): ReplayMemoryEntry | null {
  const swallowedPetId = resolvePetIdFromUnknown(swallowedRaw);
  if (!Number.isFinite(swallowedPetId)) {
    return null;
  }
  const entry: ReplayMemoryEntry = { Enu: swallowedPetId };
  const swallowed = getRecord(swallowedRaw);
  if (!swallowed) {
    return entry;
  }
  const attack = toFiniteNumber(
    swallowed['attack'] ?? swallowed['At'] ?? swallowed['at'],
    NaN,
  );
  if (Number.isFinite(attack)) {
    entry.At = Math.max(0, Math.round(attack));
  }
  const health = toFiniteNumber(
    swallowed['health'] ?? swallowed['Hp'] ?? swallowed['hp'],
    NaN,
  );
  if (Number.isFinite(health)) {
    entry.Hp = Math.max(1, Math.round(health));
  }
  const mana = toFiniteNumber(swallowed['mana'] ?? swallowed['Mana'], NaN);
  if (Number.isFinite(mana)) {
    entry.Mana = Math.max(0, Math.round(mana));
  }
  const level = toFiniteNumber(
    swallowed['level'] ?? swallowed['lvl'] ?? swallowed['Lvl'],
    NaN,
  );
  if (Number.isFinite(level)) {
    entry.Lvl = Math.max(1, Math.min(3, Math.round(level)));
  }
  const exp = toFiniteNumber(swallowed['exp'] ?? swallowed['Exp'], NaN);
  if (Number.isFinite(exp)) {
    entry.Exp = Math.max(0, Math.round(exp));
  }
  const perk = swallowed['perk'] ?? swallowed['Perk'];
  const perkNumber = toNullableNumber(perk);
  if (perkNumber !== null) {
    entry.Perk = perkNumber;
  }
  return entry;
}

export function collectAbominationSwallowedEntries(
  rawPet: unknown,
  maps?: ReplayParserLookupMaps,
): AbominationSwallowedEntry[] {
  const slotConfigs: AbominationSlotConfig[] = [
    {
      petKey: 'abominationSwallowedPet1',
      levelKey: 'abominationSwallowedPet1Level',
      belugaKey: 'abominationSwallowedPet1BelugaSwallowedPet',
      sfsKey: 'abominationSwallowedPet1SarcasticFringeheadSwallowedPet',
    },
    {
      petKey: 'abominationSwallowedPet2',
      levelKey: 'abominationSwallowedPet2Level',
      belugaKey: 'abominationSwallowedPet2BelugaSwallowedPet',
      sfsKey: 'abominationSwallowedPet2SarcasticFringeheadSwallowedPet',
    },
    {
      petKey: 'abominationSwallowedPet3',
      levelKey: 'abominationSwallowedPet3Level',
      belugaKey: 'abominationSwallowedPet3BelugaSwallowedPet',
      sfsKey: 'abominationSwallowedPet3SarcasticFringeheadSwallowedPet',
    },
  ];
  const root = getRecord(rawPet);
  const entries: AbominationSwallowedEntry[] = [];
  for (const slotConfig of slotConfigs) {
    const swallowedRaw = root?.[slotConfig.petKey];
    const swallowedPetId = resolvePetIdFromUnknown(swallowedRaw, maps);
    if (!Number.isFinite(swallowedPetId)) {
      continue;
    }
    const swallowedRecord = getRecord(swallowedRaw);
    const swallowedAbilityEnums = getAbilityEnumsForPet(swallowedPetId, maps);
    const memoryEntry =
      buildBelugaSwallowedEntry(swallowedRaw) ?? ({ Enu: swallowedPetId } as ReplayMemoryEntry);
    const swallowedLevel = toFiniteNumber(root?.[slotConfig.levelKey], NaN);
    if (Number.isFinite(swallowedLevel)) {
      memoryEntry.Lvl = Math.max(1, Math.min(3, Math.round(swallowedLevel)));
    }

    if (swallowedPetId === 182) {
      const belugaRaw =
        root?.[slotConfig.belugaKey] ?? swallowedRecord?.['belugaSwallowedPet'] ?? null;
      const belugaEntry = buildBelugaSwallowedEntry(belugaRaw);
      if (belugaEntry) {
        const belugaAbilityEnums = getAbilityEnumsForPet(182, maps);
        const belugaLists: Record<string, ReplayUnknownRecord[]> = {
          WhiteWhaleAbility: [{ ...belugaEntry }],
        };
        for (const abilityEnum of belugaAbilityEnums) {
          belugaLists[String(abilityEnum)] = [{ ...belugaEntry }];
        }
        memoryEntry.MiMs = { Lsts: belugaLists };
      }
    }

    if (swallowedPetId === 763) {
      const sfsRaw =
        root?.[slotConfig.sfsKey] ??
        swallowedRecord?.['sarcasticFringeheadSwallowedPet'] ??
        null;
      const sfsEntry = buildBelugaSwallowedEntry(sfsRaw);
      if (sfsEntry) {
        const sfsLists: Record<string, ReplayUnknownRecord[]> = {
          SarcasticFringeheadAbility: [{ ...sfsEntry }],
        };
        memoryEntry.MiMs = { Lsts: sfsLists };
      }
    }

    entries.push({
      swallowedPetId,
      swallowedAbilityEnums,
      memoryEntry,
      belugaSwallowedEntry: memoryEntry.MiMs ?? null,
    });
  }

  const swallowedCandidates = Array.isArray(root?.['abominationSwallowedPets'])
    ? (root?.['abominationSwallowedPets'] as unknown[])
    : [];
  for (const swallowed of swallowedCandidates) {
    const swallowedPetId = resolvePetIdFromUnknown(swallowed, maps);
    if (!Number.isFinite(swallowedPetId)) {
      continue;
    }
    const swallowedAbilityEnums = getAbilityEnumsForPet(swallowedPetId, maps);
    entries.push({
      swallowedPetId,
      swallowedAbilityEnums,
      memoryEntry:
        buildBelugaSwallowedEntry(swallowed) ??
        ({ Enu: swallowedPetId } as ReplayMemoryEntry),
      belugaSwallowedEntry: null,
    });
  }

  return entries;
}

export function inferAbominationAbilityEnumsFromSwallowedPets(
  rawPet: unknown,
  maps?: ReplayParserLookupMaps,
): number[] {
  const entries = collectAbominationSwallowedEntries(rawPet, maps);
  const abilityEnums: number[] = [];
  for (const entry of entries) {
    if (Array.isArray(entry.swallowedAbilityEnums)) {
      abilityEnums.push(...entry.swallowedAbilityEnums);
    }
  }
  return uniqueNumbers(abilityEnums);
}

export function inferAbominationAbilityLevelsFromSwallowedPets(
  rawPet: unknown,
  maps?: ReplayParserLookupMaps,
): Record<string, number> {
  const entries = collectAbominationSwallowedEntries(rawPet, maps);
  const levelByAbility: Record<string, number> = {};
  const fallbackLevel = 1;
  for (const entry of entries) {
    const swallowedLevel = toFiniteNumber(entry.memoryEntry?.Lvl, NaN);
    const normalizedLevel = Number.isFinite(swallowedLevel)
      ? Math.max(1, Math.min(3, Math.round(swallowedLevel)))
      : fallbackLevel;
    const swallowedAbilityEnums = uniqueNumbers(
      Array.isArray(entry.swallowedAbilityEnums)
        ? entry.swallowedAbilityEnums
        : [],
    );
    for (const abilityEnum of swallowedAbilityEnums) {
      const key = String(abilityEnum);
      const existing = toFiniteNumber(levelByAbility[key], NaN);
      if (!Number.isFinite(existing) || normalizedLevel > existing) {
        levelByAbility[key] = normalizedLevel;
      }
    }
  }
  return levelByAbility;
}

export function inferAbominationAbilityEnumFromSwallowedPets(
  rawPet: unknown,
  maps?: ReplayParserLookupMaps,
): number | null {
  const inferred = inferAbominationAbilityEnumsFromSwallowedPets(rawPet, maps);
  return inferred.length > 0 ? inferred[0] : null;
}

export function getPrimaryAbilityEnumForMemory(
  rawPet: unknown,
  petId: number,
  maps?: ReplayParserLookupMaps,
): number | null {
  const pet = getRecord(rawPet);
  const abil = Array.isArray(pet?.['Abil']) ? (pet?.['Abil'] as unknown[]) : [];
  const abilities = Array.isArray(pet?.['abilities'])
    ? (pet?.['abilities'] as unknown[])
    : [];
  const directCandidates = [
    pet?.['abilityEnum'],
    pet?.['abilityId'],
    getRecord(abil[0])?.['Enu'],
    getRecord(abilities[0])?.['Enu'],
  ];
  for (const candidate of directCandidates) {
    const num = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(num)) {
      return Math.trunc(num);
    }
  }

  if (petId === 373 || petId === 338) {
    const inferred = inferAbominationAbilityEnumFromSwallowedPets(rawPet, maps);
    if (Number.isFinite(inferred)) {
      return Math.trunc(inferred);
    }
  }

  const mapped = getAbilityEnumsForPet(petId, maps);
  return mapped.length > 0 ? mapped[0] : null;
}

export function buildAbominationMemory(
  rawPet: unknown,
  petId: number,
  maps?: ReplayParserLookupMaps,
): ReplayMemoryPayload | null {
  const swallowedEntries = collectAbominationSwallowedEntries(rawPet, maps);
  if (swallowedEntries.length === 0) {
    return null;
  }
  const fallbackAbilityEnum = getPrimaryAbilityEnumForMemory(rawPet, petId, maps);
  const fallbackList =
    fallbackAbilityEnum !== null ? [Math.trunc(fallbackAbilityEnum)] : [];
  const lists: Record<string, ReplayUnknownRecord[]> = {};
  for (const entry of swallowedEntries) {
    const ownEnums = uniqueNumbers(
      Array.isArray(entry.swallowedAbilityEnums) ? entry.swallowedAbilityEnums : [],
    );
    const keyEnums = ownEnums.length > 0 ? ownEnums : fallbackList;
    if (keyEnums.length === 0) {
      continue;
    }
    for (const abilityEnum of keyEnums) {
      const key = String(abilityEnum);
      if (!Array.isArray(lists[key])) {
        lists[key] = [];
      }
      const useBeluga =
        entry.swallowedPetId === 182 &&
        Array.isArray(entry.swallowedAbilityEnums) &&
        entry.swallowedAbilityEnums.includes(abilityEnum) &&
        entry.belugaSwallowedEntry;
      const payload = useBeluga
        ? (entry.belugaSwallowedEntry as unknown as ReplayUnknownRecord)
        : (entry.memoryEntry as ReplayUnknownRecord);
      lists[key].push(payload);
    }
  }
  if (Object.keys(lists).length === 0) {
    return null;
  }
  return { Lsts: lists };
}

export function buildBelugaMemory(
  rawPet: unknown,
  petId: number,
  maps?: ReplayParserLookupMaps,
): ReplayMemoryPayload | null {
  const pet = getRecord(rawPet);
  const swallowedRaw = pet?.['belugaSwallowedPet'] ?? pet?.['swallowedPet'] ?? null;
  const swallowedEntry = buildBelugaSwallowedEntry(swallowedRaw);
  if (!swallowedEntry) {
    return null;
  }
  const mapped = getAbilityEnumsForPet(petId, maps);
  const primary = getPrimaryAbilityEnumForMemory(rawPet, petId, maps);
  const belugaAbilityEnums =
    mapped.length > 0
      ? mapped
      : primary !== null
        ? [Math.trunc(primary)]
        : [];
  if (belugaAbilityEnums.length === 0) {
    return null;
  }
  const lists: Record<string, ReplayUnknownRecord[]> = {
    WhiteWhaleAbility: [{ ...swallowedEntry }],
  };
  for (const abilityEnum of belugaAbilityEnums) {
    lists[String(abilityEnum)] = [{ ...swallowedEntry }];
  }
  return { Lsts: lists };
}

export function buildSarcasticFringeheadMemory(
  rawPet: unknown,
  _petId: number,
  _maps?: ReplayParserLookupMaps,
): ReplayMemoryPayload | null {
  const pet = getRecord(rawPet);
  const swallowedRaw = pet?.['sarcasticFringeheadSwallowedPet'] ?? null;
  const swallowedEntry = buildBelugaSwallowedEntry(swallowedRaw);
  if (!swallowedEntry) {
    return null;
  }
  if (!Number.isFinite(toFiniteNumber(swallowedEntry.Lvl, NaN))) {
    swallowedEntry.Lvl = 1;
  }
  if (!Number.isFinite(toFiniteNumber(swallowedEntry.At, NaN))) {
    swallowedEntry.At = 1;
  }
  if (!Number.isFinite(toFiniteNumber(swallowedEntry.Hp, NaN))) {
    swallowedEntry.Hp = 1;
  }
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Mana')) {
    swallowedEntry.Mana = null;
  }
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Perk')) {
    swallowedEntry.Perk = null;
  }
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Exp')) {
    swallowedEntry.Exp = null;
  }
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Powa')) {
    swallowedEntry.Powa = null;
  }
  return { Lsts: { SarcasticFringeheadAbility: [{ ...swallowedEntry }] } };
}

export function buildAbilityEntry(
  abilityEnum: number,
  level: number,
  triggersConsumed = 0,
): ReplayAbilityEntry {
  const normalizedTriggers = Number.isFinite(triggersConsumed)
    ? Math.max(0, Math.round(triggersConsumed))
    : 0;
  return {
    Enu: abilityEnum,
    Lvl: level,
    Nat: true,
    Dur: 0,
    TrCo: normalizedTriggers,
    Char: null,
    Dis: false,
    AIML: false,
  };
}

function findFiniteNumberByKeyPredicate(
  source: unknown,
  keyPredicate: (k: string) => boolean,
): number | null {
  const record = getRecord(source);
  if (!record) {
    return null;
  }
  for (const [key, value] of Object.entries(record)) {
    if (!keyPredicate(key)) {
      continue;
    }
    const n = toFiniteNumber(value, NaN);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return null;
}

export function getTriggersConsumedFromRawPet(rawPet: unknown): number | null {
  const pet = getRecord(rawPet);
  const direct = [
    pet?.['triggersConsumed'],
    pet?.['TrCo'],
    pet?.['trco'],
    pet?.['triggerConsumed'],
  ];
  for (const candidate of direct) {
    const n = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  const predicate = (key: string) => {
    const normalized = key.toLowerCase();
    const hasTrigger =
      normalized.includes('trigger') || normalized.includes('trig');
    const hasConsumed = normalized.includes('consum');
    const isAbbrev = ['trgc', 'trgcn', 'trc', 'trcn', 'trco'].includes(normalized);
    return (hasTrigger && hasConsumed) || isAbbrev;
  };
  const objectCandidates = [pet, getRecord(pet?.['pow']), getRecord(pet?.['Pow'])];
  for (const candidate of objectCandidates) {
    const n = findFiniteNumberByKeyPredicate(candidate, predicate);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  const abilities = Array.isArray(pet?.['abilities'])
    ? (pet?.['abilities'] as unknown[])
    : [];
  const abil = Array.isArray(pet?.['Abil']) ? (pet?.['Abil'] as unknown[]) : [];
  const abilityValues: number[] = [];
  for (const abilityArray of [abilities, abil]) {
    for (const ability of abilityArray) {
      const n = findFiniteNumberByKeyPredicate(ability, predicate);
      if (Number.isFinite(n)) {
        abilityValues.push(n);
      }
    }
  }
  if (abilityValues.length > 0) {
    return Math.max(0, Math.round(Math.max(...abilityValues)));
  }
  return null;
}

export function getTimesHurtFromRawPet(rawPet: unknown): number | null {
  const pet = getRecord(rawPet);
  const pow = getRecord(pet?.['Pow']);
  const powLower = getRecord(pet?.['pow']);
  const direct = [
    pet?.['timesHurt'],
    pet?.['TimesHurt'],
    pow?.['SabertoothTigerAbility'],
    powLower?.['SabertoothTigerAbility'],
  ];
  for (const candidate of direct) {
    const n = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  return null;
}

export function getSpellCountFromRawPet(rawPet: unknown): number {
  const pet = getRecord(rawPet);
  const direct = [
    pet?.['spellCount'],
    pet?.['spellsCast'],
    pet?.['spellsCastThisTurn'],
    pet?.['SpCT'],
  ];
  for (const candidate of direct) {
    const n = toFiniteNumber(candidate, NaN);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.round(n));
    }
  }
  return 0;
}

export function getToyName(rawToy: unknown): string | null {
  if (typeof rawToy === 'string') {
    return rawToy;
  }
  const toy = getRecord(rawToy);
  return typeof toy?.['name'] === 'string' ? toy['name'] : null;
}

export function resolveToyId(
  rawToy: unknown,
  maps?: ReplayParserLookupMaps,
): number | null {
  if (rawToy === null || rawToy === undefined) {
    return null;
  }
  const toy = getRecord(rawToy);
  if (toy) {
    const direct = [toy['id'], toy['toyId'], toy['enum'], toy['Enu']];
    for (const candidate of direct) {
      const n = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(n)) {
        return Math.trunc(n);
      }
    }
  }
  const toyName = getToyName(rawToy) ?? rawToy;
  const lookupKey =
    typeof toyName === 'string'
      ? toyName.toLowerCase().replace(/[^a-z0-9]/g, '')
      : '';
  if (!lookupKey) {
    return null;
  }
  const mapped = toIntOrNull(maps?.toyIdsByName?.[lookupKey]);
  if (mapped !== null) {
    return mapped;
  }
  const fallback = FALLBACK_TOY_IDS_BY_NAME[lookupKey];
  return Number.isFinite(fallback) ? fallback : null;
}

export function resolveToyAbilityEnum(
  rawToy: unknown,
  toyId: number | null,
): number | null {
  const toy = getRecord(rawToy);
  if (toy) {
    const abil = Array.isArray(toy['Abil']) ? (toy['Abil'] as unknown[]) : [];
    const abilities = Array.isArray(toy['abilities'])
      ? (toy['abilities'] as unknown[])
      : [];
    const direct = [
      toy['abilityEnum'],
      toy['abilityId'],
      getRecord(abil[0])?.['Enu'],
      getRecord(abilities[0])?.['Enu'],
    ];
    for (const candidate of direct) {
      const n = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(n)) {
        return Math.trunc(n);
      }
    }
  }
  if (Number.isFinite(Number(toyId))) {
    return Math.trunc(Number(toyId) + 32);
  }
  return null;
}

export function resolveToyUsesLeft(rawToy: unknown, toyLevel: number): number {
  const toy = getRecord(rawToy);
  if (toy) {
    const direct = [toy['cou'], toy['Cou'], toy['usesLeft'], toy['charges']];
    for (const candidate of direct) {
      const n = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(n)) {
        return Math.max(0, Math.round(n));
      }
    }
  }
  return Math.max(1, 3 - toyLevel);
}

export function resolveToyHealthPerm(rawToy: unknown, toyLevel: number): number {
  const toy = getRecord(rawToy);
  if (toy) {
    const hp = getRecord(toy['Hp']);
    const direct = [toy['hp'], toy['health'], hp?.['Perm']];
    for (const candidate of direct) {
      const n = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(n)) {
        return Math.max(1, Math.round(n));
      }
    }
  }
  return Math.max(1, 3 + (toyLevel - 1) * 4);
}

export function buildRelicItems(
  boardId: string,
  rawToy: unknown,
  rawToyLevel: unknown,
  warningBag: ReplayWarningBag,
  maps?: ReplayParserLookupMaps,
): [null, ReplayRelicItem | null] {
  const toyId = resolveToyId(rawToy, maps);
  const toyName = getToyName(rawToy) ?? (typeof rawToy === 'string' ? rawToy : '');
  if (!Number.isFinite(Number(toyId))) {
    if (toyName) {
      warningBag.unknownToys.push(String(toyName));
    }
    return [null, null];
  }
  const toyLevel = Math.max(1, Math.round(toFiniteNumber(rawToyLevel, 1)));
  const toyAbilityEnum = resolveToyAbilityEnum(rawToy, toyId);
  const toyUsesLeft = resolveToyUsesLeft(rawToy, toyLevel);
  const toyHealthPerm = resolveToyHealthPerm(rawToy, toyLevel);
  const toyRelic: ReplayRelicItem = {
    Own: 1,
    Enu: toyId,
    Loc: 4,
    Poi: { x: 1, y: 0 },
    Exp: 0,
    Lvl: toyLevel,
    Hp: { Perm: toyHealthPerm, Temp: 0, Max: null },
    At: { Perm: 1000, Temp: 0, Max: 1000 },
    Mana: 0,
    Cou: toyUsesLeft,
    PeBo: false,
    PeDu: null,
    PeDM: null,
    PeMu: null,
    PeDr: 0,
    Abil:
      toyAbilityEnum !== null ? [buildAbilityEntry(toyAbilityEnum, toyLevel, 0)] : [],
    AbDi: false,
    Cosm: 0,
    Dead: false,
    Dest: false,
    DeBy: null,
    Link: null,
    Pow: null,
    SeV: null,
    Rwds: 0,
    Rwrd: false,
    MiMs: null,
    SpMe: null,
    Tri: null,
    AtkC: 0,
    HrtC: 0,
    SpCT: 0,
    OlTs: null,
    LastTargetsThisTurn: null,
    Id: { BoId: boardId, Uni: 900 },
    Pri: 3,
    Fro: false,
    WFro: false,
    AFro: false,
  };
  return [null, toyRelic];
}

export const REPLAY_DEBUG_ENABLED = (() => {
  try {
    const fromStorage = localStorage.getItem('sapReplayDebug');
    if (fromStorage === '1') {
      return true;
    }
  } catch {
    return false;
  }
  try {
    return new URL(window.location.href).searchParams.get('sapReplayDebug') === '1';
  } catch {
    return false;
  }
})();

export function replayDebug(...args: unknown[]): void {
  if (!REPLAY_DEBUG_ENABLED) {
    return;
  }
  console.log('[SAP Replay Debug]', ...args);
}
