/* Utilities ported/adapted from replay parity fixes PR.
   Purpose: robust pet/toy id resolution, ability fallbacks, abomination
   swallowed-pet inference, and small helpers used by the replay parser.
*/

export const FALLBACK_ABILITY_IDS_BY_PET_ID: Record<string, number[]> = {
  "338": [368],
  "373": [403],
  "635": [669],
  // Sarcastic Fringehead observed multiple ability enums in payloads
  "763": [853, 970]
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
  toymouse: 327
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function toFiniteNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function resolvePetIdFromUnknown(value: unknown, maps?: any): number | null {
  if (value === null || value === undefined) return null;
  if (isPlainObject(value)) {
    // Try common numeric fields
    const directIdCandidates = [value['id'], value['Id'], value['petId'], value['PetId'], value['enum'], value['Enum'], value['Enu'], value['enu']];
    for (const candidate of directIdCandidates) {
      if (candidate === undefined || candidate === null) continue;
      const numeric = toFiniteNumber(candidate, NaN);
      if (Number.isFinite(numeric)) return Math.trunc(numeric);
    }

    // Fall back to name lookup
    const name = ((value as any).name) || (value as any).Name || null;
    if (typeof name === 'string') {
      const key = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
      const petIdsByName = maps?.petIdsByName || maps?.PET_IDS_BY_NAME;
      if (petIdsByName && (typeof petIdsByName.get === 'function')) {
        const id = petIdsByName.get(key);
        if (id !== undefined) return Math.trunc(Number(id));
      }
      if (petIdsByName && Number.isFinite(petIdsByName[key])) return Math.trunc(Number(petIdsByName[key]));
    }
    return null;
  }

  if (typeof value === 'string') {
    const s = value.trim();
    if (s === '') return null;
    const numeric = toFiniteNumber(s, NaN);
    if (Number.isFinite(numeric)) return Math.trunc(numeric);
    const key = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const petIdsByName = maps?.petIdsByName || maps?.PET_IDS_BY_NAME;
    if (petIdsByName && (typeof petIdsByName.get === 'function')) {
      const id = petIdsByName.get(key);
      if (id !== undefined) return Math.trunc(Number(id));
    }
    if (petIdsByName && Number.isFinite(petIdsByName[key])) return Math.trunc(Number(petIdsByName[key]));
    return null;
  }

  // numbers
  const numeric = toFiniteNumber(value, NaN);
  if (Number.isFinite(numeric)) return Math.trunc(numeric);
  return null;
}

export function uniqueNumbers(values: unknown[]): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  for (const v of values) {
    if (v === null || v === undefined) continue;
    const n = Number(v);
    if (!Number.isFinite(n)) continue;
    const normalized = Math.trunc(n);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

export function getAbilityEnumsForPet(petId: number, maps?: any): number[] {
  const abilityMap = maps?.abilityIdsByPetId || {};
  const key = String(petId);
  const mapped = Array.isArray(abilityMap[key]) ? abilityMap[key] : [];
  const fallback = Array.isArray(FALLBACK_ABILITY_IDS_BY_PET_ID[key]) ? FALLBACK_ABILITY_IDS_BY_PET_ID[key] : [];
  return uniqueNumbers([...mapped, ...fallback]);
}

function buildBelugaSwallowedEntry(swallowedRaw: any): any | null {
  const swallowedPetId = resolvePetIdFromUnknown(swallowedRaw);
  if (!Number.isFinite(swallowedPetId)) return null;
  const entry: any = { Enu: swallowedPetId };
  if (!isPlainObject(swallowedRaw)) return entry;
  const attack = toFiniteNumber(swallowedRaw.attack ?? swallowedRaw.At ?? swallowedRaw.at, NaN);
  if (Number.isFinite(attack)) entry.At = Math.max(0, Math.round(attack));
  const health = toFiniteNumber(swallowedRaw.health ?? swallowedRaw.Hp ?? swallowedRaw.hp, NaN);
  if (Number.isFinite(health)) entry.Hp = Math.max(1, Math.round(health));
  const mana = toFiniteNumber(swallowedRaw.mana ?? swallowedRaw.Mana, NaN);
  if (Number.isFinite(mana)) entry.Mana = Math.max(0, Math.round(mana));
  const level = toFiniteNumber(swallowedRaw.level ?? swallowedRaw.lvl ?? swallowedRaw.Lvl, NaN);
  if (Number.isFinite(level)) entry.Lvl = Math.max(1, Math.min(3, Math.round(level)));
  const exp = toFiniteNumber(swallowedRaw.exp ?? swallowedRaw.Exp, NaN);
  if (Number.isFinite(exp)) entry.Exp = Math.max(0, Math.round(exp));
  const perk = swallowedRaw?.perk ?? swallowedRaw?.Perk ?? null;
  if (perk !== null && perk !== undefined) entry.Perk = Number(perk);
  return entry;
}

export function collectAbominationSwallowedEntries(rawPet: any, maps?: any) {
  const slotConfigs = [
    { petKey: 'abominationSwallowedPet1', levelKey: 'abominationSwallowedPet1Level', belugaKey: 'abominationSwallowedPet1BelugaSwallowedPet', sfsKey: 'abominationSwallowedPet1SarcasticFringeheadSwallowedPet' },
    { petKey: 'abominationSwallowedPet2', levelKey: 'abominationSwallowedPet2Level', belugaKey: 'abominationSwallowedPet2BelugaSwallowedPet', sfsKey: 'abominationSwallowedPet2SarcasticFringeheadSwallowedPet' },
    { petKey: 'abominationSwallowedPet3', levelKey: 'abominationSwallowedPet3Level', belugaKey: 'abominationSwallowedPet3BelugaSwallowedPet', sfsKey: 'abominationSwallowedPet3SarcasticFringeheadSwallowedPet' }
  ];
  const entries: Array<any> = [];
  for (const slotConfig of slotConfigs) {
    const swallowedRaw = rawPet?.[slotConfig.petKey];
    const swallowedPetId = resolvePetIdFromUnknown(swallowedRaw, maps);
    if (!Number.isFinite(swallowedPetId)) continue;
    const swallowedAbilityEnums = getAbilityEnumsForPet(swallowedPetId, maps);
    const memoryEntry = buildBelugaSwallowedEntry(swallowedRaw) || { Enu: swallowedPetId };
    const swallowedLevel = toFiniteNumber(rawPet?.[slotConfig.levelKey], NaN);
    if (Number.isFinite(swallowedLevel)) memoryEntry.Lvl = Math.max(1, Math.min(3, Math.round(swallowedLevel)));

    // If swallowed is Beluga, preserve its inner swallowed chain
    if (swallowedPetId === 182) {
      const belugaRaw = rawPet?.[slotConfig.belugaKey] ?? swallowedRaw?.belugaSwallowedPet ?? null;
      const belugaEntry = buildBelugaSwallowedEntry(belugaRaw);
      if (belugaEntry) {
        const belugaAbilityEnums = getAbilityEnumsForPet(182, maps);
        const belugaLists: any = { WhiteWhaleAbility: [{ ...belugaEntry }] };
        for (const a of belugaAbilityEnums) belugaLists[String(a)] = [{ ...belugaEntry }];
        memoryEntry.MiMs = { Lsts: belugaLists };
      }
    }

    // Sarcastic Fringehead handling
    if (swallowedPetId === 763) {
      const sfsRaw = rawPet?.[slotConfig.sfsKey] ?? swallowedRaw?.sarcasticFringeheadSwallowedPet ?? null;
      const sfsEntry = buildBelugaSwallowedEntry(sfsRaw);
      if (sfsEntry) {
        const sfsLists: any = { SarcasticFringeheadAbility: [{ ...sfsEntry }] };
        memoryEntry.MiMs = { Lsts: sfsLists };
      }
    }

    entries.push({ swallowedPetId, swallowedAbilityEnums, memoryEntry, belugaSwallowedEntry: memoryEntry?.MiMs ? memoryEntry.MiMs : null });
  }

  // Fallback: legacy array form
  const swallowedCandidates = Array.isArray(rawPet?.abominationSwallowedPets) ? rawPet.abominationSwallowedPets : [];
  for (const swallowed of swallowedCandidates) {
    const swallowedPetId = resolvePetIdFromUnknown(swallowed, maps);
    if (!Number.isFinite(swallowedPetId)) continue;
    const swallowedAbilityEnums = getAbilityEnumsForPet(swallowedPetId, maps);
    entries.push({ swallowedPetId, swallowedAbilityEnums, memoryEntry: buildBelugaSwallowedEntry(swallowed) || { Enu: swallowedPetId } });
  }

  return entries;
}

export function inferAbominationAbilityEnumsFromSwallowedPets(rawPet: any, maps?: any): number[] {
  const entries = collectAbominationSwallowedEntries(rawPet, maps);
  const abilityEnums: number[] = [];
  for (const entry of entries) {
    if (Array.isArray(entry.swallowedAbilityEnums)) abilityEnums.push(...entry.swallowedAbilityEnums);
  }
  return uniqueNumbers(abilityEnums);
}

export function inferAbominationAbilityLevelsFromSwallowedPets(rawPet: any, maps?: any): Record<string, number> {
  const entries = collectAbominationSwallowedEntries(rawPet, maps);
  const levelByAbility: Record<string, number> = {};
  const fallbackLevel = 1;
  for (const entry of entries) {
    const swallowedLevel = toFiniteNumber(entry?.memoryEntry?.Lvl, NaN);
    const normalizedLevel = Number.isFinite(swallowedLevel) ? Math.max(1, Math.min(3, Math.round(swallowedLevel))) : fallbackLevel;
    const swallowedAbilityEnums = uniqueNumbers(Array.isArray(entry?.swallowedAbilityEnums) ? entry.swallowedAbilityEnums : []);
    for (const abilityEnum of swallowedAbilityEnums) {
      const key = String(abilityEnum);
      const existing = toFiniteNumber(levelByAbility[key], NaN);
      if (!Number.isFinite(existing) || normalizedLevel > existing) levelByAbility[key] = normalizedLevel;
    }
  }
  return levelByAbility;
}

export function inferAbominationAbilityEnumFromSwallowedPets(rawPet: any, maps?: any): number | null {
  const inferred = inferAbominationAbilityEnumsFromSwallowedPets(rawPet, maps);
  return inferred.length > 0 ? inferred[0] : null;
}

export function getPrimaryAbilityEnumForMemory(rawPet: any, petId: number, maps?: any): number | null {
  const directCandidates = [rawPet?.abilityEnum, rawPet?.abilityId, rawPet?.Abil?.[0]?.Enu, rawPet?.abilities?.[0]?.Enu];
  for (const c of directCandidates) {
    const num = toFiniteNumber(c, NaN);
    if (Number.isFinite(num)) return Math.trunc(num);
  }

  if (petId === 373 || petId === 338) {
    const inferred = inferAbominationAbilityEnumFromSwallowedPets(rawPet, maps);
    if (Number.isFinite(inferred)) return Math.trunc(inferred as number);
  }

  const mapped = getAbilityEnumsForPet(petId, maps);
  return mapped.length > 0 ? mapped[0] : null;
}

export function buildAbominationMemory(rawPet: any, petId: number, maps?: any) {
  const swallowedEntries = collectAbominationSwallowedEntries(rawPet, maps);
  if (swallowedEntries.length === 0) return null;
  const fallbackAbilityEnum = getPrimaryAbilityEnumForMemory(rawPet, petId, maps);
  const fallbackList = Number.isFinite(fallbackAbilityEnum) ? [Math.trunc(fallbackAbilityEnum)] : [];
  const lists: Record<string, any[]> = {};
  for (const entry of swallowedEntries) {
    const ownEnums = uniqueNumbers(Array.isArray(entry.swallowedAbilityEnums) ? entry.swallowedAbilityEnums : []);
    const keyEnums = ownEnums.length > 0 ? ownEnums : fallbackList;
    if (keyEnums.length === 0) continue;
    for (const e of keyEnums) {
      const key = String(e);
      if (!Array.isArray(lists[key])) lists[key] = [];
      const useBeluga = entry.swallowedPetId === 182 && Array.isArray(entry.swallowedAbilityEnums) && entry.swallowedAbilityEnums.includes(e) && entry.belugaSwallowedEntry;
      const payload = useBeluga ? entry.belugaSwallowedEntry : (entry.memoryEntry || { Enu: entry.swallowedPetId });
      lists[key].push(payload);
    }
  }
  if (Object.keys(lists).length === 0) return null;
  return { Lsts: lists };
}

export function buildBelugaMemory(rawPet: any, petId: number, maps?: any) {
  const swallowedRaw = rawPet?.belugaSwallowedPet ?? rawPet?.swallowedPet ?? null;
  const swallowedEntry = buildBelugaSwallowedEntry(swallowedRaw);
  if (!swallowedEntry) return null;
  const mapped = getAbilityEnumsForPet(petId, maps);
  const primary = getPrimaryAbilityEnumForMemory(rawPet, petId, maps);
  const belugaAbilityEnums = mapped.length > 0 ? mapped : (Number.isFinite(primary) ? [Math.trunc(primary as number)] : []);
  if (belugaAbilityEnums.length === 0) return null;
  const lists: any = { WhiteWhaleAbility: [{ ...swallowedEntry }] };
  for (const a of belugaAbilityEnums) lists[String(a)] = [{ ...swallowedEntry }];
  return { Lsts: lists };
}

export function buildSarcasticFringeheadMemory(rawPet: any, petId: number, maps?: any) {
  const swallowedRaw = rawPet?.sarcasticFringeheadSwallowedPet ?? null;
  const swallowedEntry = buildBelugaSwallowedEntry(swallowedRaw);
  if (!swallowedEntry) return null;
  if (!Number.isFinite(toFiniteNumber(swallowedEntry.Lvl, NaN))) swallowedEntry.Lvl = 1;
  if (!Number.isFinite(toFiniteNumber(swallowedEntry.At, NaN))) swallowedEntry.At = 1;
  if (!Number.isFinite(toFiniteNumber(swallowedEntry.Hp, NaN))) swallowedEntry.Hp = 1;
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Mana')) swallowedEntry.Mana = null;
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Perk')) swallowedEntry.Perk = null;
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Exp')) swallowedEntry.Exp = null;
  if (!Object.prototype.hasOwnProperty.call(swallowedEntry, 'Powa')) swallowedEntry.Powa = null;
  return { Lsts: { SarcasticFringeheadAbility: [{ ...swallowedEntry }] } };
}

export function buildAbilityEntry(abilityEnum: number, level: number, triggersConsumed = 0): any {
  const normalizedTriggers = Number.isFinite(triggersConsumed) ? Math.max(0, Math.round(triggersConsumed)) : 0;
  return {
    Enu: abilityEnum,
    Lvl: level,
    Nat: true,
    Dur: 0,
    TrCo: normalizedTriggers,
    Char: null,
    Dis: false,
    AIML: false
  };
}

function findFiniteNumberByKeyPredicate(source: any, keyPredicate: (k: string) => boolean) {
  if (!isPlainObject(source)) return null;
  for (const [k, v] of Object.entries(source)) {
    if (!keyPredicate(k)) continue;
    const n = toFiniteNumber(v, NaN);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

export function getTriggersConsumedFromRawPet(rawPet: any): number | null {
  const direct = [rawPet?.triggersConsumed, rawPet?.TrCo, rawPet?.trco, rawPet?.triggerConsumed];
  for (const c of direct) {
    const n = toFiniteNumber(c, NaN);
    if (Number.isFinite(n)) return Math.max(0, Math.round(n));
  }
  const predicate = (key: string) => {
    const norm = String(key || '').toLowerCase();
    const hasTrigger = norm.includes('trigger') || norm.includes('trig');
    const hasConsumed = norm.includes('consum');
    const isAbbrev = ['trgc', 'trgcn', 'trc', 'trcn', 'trco'].includes(norm);
    return (hasTrigger && hasConsumed) || isAbbrev;
  };
  const objectCandidates = [rawPet, rawPet?.pow, rawPet?.Pow];
  for (const candidate of objectCandidates) {
    const n = findFiniteNumberByKeyPredicate(candidate, predicate);
    if (Number.isFinite(n)) return Math.max(0, Math.round(n));
  }
  const abilityArrays = [rawPet?.abilities, rawPet?.Abil];
  const abilityValues: number[] = [];
  for (const arr of abilityArrays) {
    if (!Array.isArray(arr)) continue;
    for (const a of arr) {
      const n = findFiniteNumberByKeyPredicate(a, predicate);
      if (Number.isFinite(n)) abilityValues.push(n as number);
    }
  }
  if (abilityValues.length > 0) return Math.max(0, Math.round(Math.max(...abilityValues)));
  return null;
}

export function getTimesHurtFromRawPet(rawPet: any): number | null {
  const direct = [rawPet?.timesHurt, rawPet?.TimesHurt, rawPet?.Pow?.SabertoothTigerAbility, rawPet?.pow?.SabertoothTigerAbility];
  for (const c of direct) {
    const n = toFiniteNumber(c, NaN);
    if (Number.isFinite(n)) return Math.max(0, Math.round(n));
  }
  return null;
}

export function getSpellCountFromRawPet(rawPet: any): number {
  const direct = [rawPet?.spellCount, rawPet?.spellsCast, rawPet?.spellsCastThisTurn, rawPet?.SpCT];
  for (const c of direct) {
    const n = toFiniteNumber(c, NaN);
    if (Number.isFinite(n)) return Math.max(0, Math.round(n));
  }
  return 0;
}

export function getToyName(rawToy: any): string | null {
  if (typeof rawToy === 'string') return rawToy;
  if (isPlainObject(rawToy) && typeof rawToy.name === 'string') return rawToy.name;
  return null;
}

export function resolveToyId(rawToy: any, maps?: any): number | null {
  if (rawToy === null || rawToy === undefined) return null;
  if (isPlainObject(rawToy)) {
    const direct = [rawToy.id, rawToy.toyId, rawToy.enum, rawToy.Enu];
    for (const c of direct) {
      const n = toFiniteNumber(c, NaN);
      if (Number.isFinite(n)) return Math.trunc(n);
    }
  }
  const toyName = getToyName(rawToy) ?? rawToy;
  const lookupKey = typeof toyName === 'string' ? toyName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  if (!lookupKey) return null;
  const mapped = maps?.toyIdsByName?.[lookupKey];
  if (Number.isFinite(mapped)) return mapped;
  const fallback = FALLBACK_TOY_IDS_BY_NAME[lookupKey];
  return Number.isFinite(fallback) ? fallback : null;
}

export function resolveToyAbilityEnum(rawToy: any, toyId: number | null): number | null {
  if (isPlainObject(rawToy)) {
    const r: any = rawToy;
    const direct = [r.abilityEnum, r.abilityId, r.Abil?.[0]?.Enu, r.abilities?.[0]?.Enu];
    for (const c of direct) {
      const n = toFiniteNumber(c, NaN);
      if (Number.isFinite(n)) return Math.trunc(n);
    }
  }
  // Observed pattern: toy ability enum is offset by +32 from toy id
  if (Number.isFinite(Number(toyId))) return Math.trunc(Number(toyId) + 32);
  return null;
}

export function resolveToyUsesLeft(rawToy: any, toyLevel: number): number {
  if (isPlainObject(rawToy)) {
    const direct = [rawToy.cou, rawToy.Cou, rawToy.usesLeft, rawToy.charges];
    for (const c of direct) {
      const n = toFiniteNumber(c, NaN);
      if (Number.isFinite(n)) return Math.max(0, Math.round(n));
    }
  }
  // Matches observed live pattern: L1 => 2, L2 => 1
  return Math.max(1, 3 - toyLevel);
}

export function resolveToyHealthPerm(rawToy: any, toyLevel: number): number {
  if (isPlainObject(rawToy)) {
    const r: any = rawToy;
    const direct = [r.hp, r.health, r.Hp?.Perm];
    for (const c of direct) {
      const n = toFiniteNumber(c, NaN);
      if (Number.isFinite(n)) return Math.max(1, Math.round(n));
    }
  }
  return Math.max(1, 3 + ((toyLevel - 1) * 4));
}

export function buildRelicItems(boardId: string, rawToy: any, rawToyLevel: any, warningBag: any, maps?: any) {
  const toyId = resolveToyId(rawToy, maps);
  const toyName = getToyName(rawToy) || (typeof rawToy === 'string' ? rawToy : '');
  if (!Number.isFinite(Number(toyId))) {
    if (toyName) warningBag.unknownToys.push(String(toyName));
    return [null, null];
  }
  const toyLevel = Math.max(1, Math.round(toFiniteNumber(rawToyLevel, 1)));
  const toyAbilityEnum = resolveToyAbilityEnum(rawToy, toyId);
  const toyUsesLeft = resolveToyUsesLeft(rawToy, toyLevel);
  const toyHealthPerm = resolveToyHealthPerm(rawToy, toyLevel);
  const toyRelic: any = {
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
    Abil: Number.isFinite(Number(toyAbilityEnum)) ? [buildAbilityEntry(toyAbilityEnum as number, toyLevel, 0)] : [],
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
    AFro: false
  };
  return [null, toyRelic];
}

export const REPLAY_DEBUG_ENABLED = (() => {
  try {
    const fromStorage = localStorage.getItem('sapReplayDebug');
    if (fromStorage === '1') return true;
  } catch { }
  try {
    return new URL(window.location.href).searchParams.get('sapReplayDebug') === '1';
  } catch { return false; }
})();

export function replayDebug(...args: any[]) {
  if (!REPLAY_DEBUG_ENABLED) return;
  // eslint-disable-next-line no-console
  console.log('[SAP Replay Debug]', ...args);
}
