import * as petsJson from 'assets/data/pets.json';
import * as toysJson from 'assets/data/toys.json';
import * as perksJson from 'assets/data/perks.json';

interface NameIdEntry {
  Name?: string;
  NameId?: string;
}

interface AbilityEntry {
  Level?: number;
  About?: string;
}

interface PetAbilityEntry extends NameIdEntry {
  Abilities?: AbilityEntry[];
  PerkNote?: string;
}

interface ToyAbilityEntry extends NameIdEntry {
  Abilities?: AbilityEntry[];
}

interface EquipmentAbilityEntry extends NameIdEntry {
  Ability?: string;
}

const getNameList = (entries: NameIdEntry[]): string[] =>
  entries
    .map((entry) => entry?.Name)
    .filter((name): name is string => Boolean(name));

const petNameOverrides: Record<string, string> = {
  'Beluga Whale': 'WhiteWhale',
  'Great One': 'Cthulu',
  'Small One': 'BabyCthulhu',
  Abomination: 'Shoggoth',
  Visitor: 'Xenomorph',
  Swordfish: 'SwordFish',
  Doberman: 'DobermanDog',
  'Highland Cow': 'HighlandCow',
  'Sabertooth Tiger': 'SaberToothTiger',
  'Moby Dick': 'MochaDick',
  'Chimera Goat': 'ChimeraGoat',
  'Chimera Lion': 'ChimeraLion',
  'Chimera Snake': 'ChimeraSnake',
  'Fake Nessie': 'FakeNessie',
  'Tand and Tand': 'ThorGoats',
};

export const perkNameOverrides: Record<string, string> = {
  Corncob: 'Corn',
  'Cake Slice': 'BirthdayCakeSlice',
  'Peanut Butter': 'PeanutButter',
  'Mana Potion': 'ManaPotion',
  'Faint Bread': 'DeadBread',
  Kiwifruit: 'Kiwi',
  Eggplant: 'EggPlant',
  Rice: 'RiceBall',
  Donut: 'Doughnut',
  Cherry: 'Cherries',
  'Melon Slice': 'WaterMelon',
  Cold: 'Frozen',
  Crisp: 'Burn',
  Dazed: 'Deaf',
  Icky: 'Acid',
  Inked: 'Ink',
  Spooked: 'Scared',
  Sleepy: 'Drowsy',
  Webbed: 'Web',
  Cursed: 'Curse',
  Silly: 'Silly',
  Bloated: 'Bloated',
};
const perkNameOverridesLower = Object.fromEntries(
  Object.entries(perkNameOverrides).map(([key, value]) => [
    key.toLowerCase(),
    value,
  ]),
);

const normalize = (name: string): string => {
  if (!name) {
    return '';
  }
  return name.replace(/[^a-zA-Z0-9]/g, '');
};

const buildNameIdMap = (entries: NameIdEntry[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const entry of entries) {
    if (entry?.Name && entry?.NameId) {
      map.set(entry.Name, entry.NameId);
    }
  }
  return map;
};

const formatAbilityText = (
  abilities?: AbilityEntry[],
  perkNote?: string,
): string | null => {
  const lines: string[] = [];
  if (Array.isArray(abilities)) {
    for (const ability of abilities) {
      if (!ability?.About) {
        continue;
      }
      if (ability.Level != null) {
        lines.push(`Lv${ability.Level}: ${ability.About}`);
      } else {
        lines.push(ability.About);
      }
    }
  }
  if (perkNote) {
    lines.push(perkNote);
  }
  return lines.length ? lines.join('\n') : null;
};

const petNameIds = buildNameIdMap(
  (petsJson as unknown as { default?: NameIdEntry[] }).default ??
    (petsJson as unknown as NameIdEntry[]) ??
    [],
);
const petAbilityMap = new Map<string, string>();
const petAbilityEntries =
  (petsJson as unknown as { default?: PetAbilityEntry[] }).default ??
  (petsJson as unknown as PetAbilityEntry[]) ??
  [];
for (const entry of petAbilityEntries) {
  if (!entry?.Name) {
    continue;
  }
  const abilityText = formatAbilityText(entry.Abilities, entry.PerkNote);
  if (abilityText) {
    petAbilityMap.set(entry.Name, abilityText);
  }
}
const petNames = getNameList(
  (petsJson as unknown as { default?: NameIdEntry[] }).default ??
    (petsJson as unknown as NameIdEntry[]) ??
    [],
);
const toyNameIds = buildNameIdMap(
  (toysJson as unknown as { default?: NameIdEntry[] }).default ??
    (toysJson as unknown as NameIdEntry[]) ??
    [],
);
const toyAbilityMap = new Map<string, string>();
const toyAbilityEntries =
  (toysJson as unknown as { default?: ToyAbilityEntry[] }).default ??
  (toysJson as unknown as ToyAbilityEntry[]) ??
  [];
for (const entry of toyAbilityEntries) {
  if (!entry?.Name) {
    continue;
  }
  const abilityText = formatAbilityText(entry.Abilities);
  if (abilityText) {
    toyAbilityMap.set(entry.Name, abilityText);
  }
}
const toyNames = getNameList(
  (toysJson as unknown as { default?: NameIdEntry[] }).default ??
    (toysJson as unknown as NameIdEntry[]) ??
    [],
);
const equipmentNameIds = buildNameIdMap(
  (perksJson as unknown as { default?: NameIdEntry[] }).default ??
    (perksJson as unknown as NameIdEntry[]) ??
    [],
);
const equipmentNameIdsLower = new Map(
  Array.from(equipmentNameIds.entries()).map(([key, value]) => [
    key.toLowerCase(),
    value,
  ]),
);
const equipmentNameIdsNormalized = new Map(
  Array.from(equipmentNameIds.entries()).map(([key, value]) => [
    normalize(key),
    value,
  ]),
);
const equipmentAbilityMap = new Map<string, string>();
const equipmentAbilityEntries =
  (perksJson as unknown as { default?: EquipmentAbilityEntry[] }).default ??
  (perksJson as unknown as EquipmentAbilityEntry[]) ??
  [];
for (const entry of equipmentAbilityEntries) {
  if (!entry?.Name) {
    continue;
  }
  if (entry.Ability) {
    equipmentAbilityMap.set(entry.Name, entry.Ability);
  }
}
const equipmentNames = getNameList(
  (perksJson as unknown as { default?: NameIdEntry[] }).default ??
    (perksJson as unknown as NameIdEntry[]) ??
    [],
);

export function toAssetFileName(name: string): string {
  return normalize(name);
}

export function getPetIconFileName(petName?: string): string | null {
  if (!petName) {
    return null;
  }
  const nameId = petNameIds.get(petName);
  if (nameId) {
    return nameId;
  }
  const mapped = petNameOverrides[petName];
  if (mapped) {
    return mapped;
  }
  return null;
}

export function getPetIconPath(petName?: string): string | null {
  const fileName = getPetIconFileName(petName);
  if (!fileName) {
    return null;
  }
  return `assets/art/Public/Public/Pets/${fileName}.png`;
}

export function getPetAbilityText(petName?: string): string | null {
  if (!petName) {
    return null;
  }
  return petAbilityMap.get(petName) ?? null;
}

export function getAllPetNames(): string[] {
  return [...petNames];
}

export function getToyIconPath(toyName?: string): string | null {
  if (!toyName) {
    return null;
  }
  const nameId = toyNameIds.get(toyName);
  const fileName = nameId ?? normalize(toyName);
  if (!fileName) {
    return null;
  }
  return `assets/art/Public/Public/Toys/${fileName}.png`;
}

export function getToyAbilityText(toyName?: string): string | null {
  if (!toyName) {
    return null;
  }
  return toyAbilityMap.get(toyName) ?? null;
}

export function getAllToyNames(): string[] {
  return [...toyNames];
}

const getEquipmentFileName = (equipmentName?: string): string | null => {
  if (!equipmentName) {
    return null;
  }
  const normalized = normalize(equipmentName);
  const nameId =
    equipmentNameIds.get(equipmentName) ??
    equipmentNameIdsLower.get(equipmentName.toLowerCase()) ??
    equipmentNameIdsNormalized.get(normalized);
  const override =
    perkNameOverrides[equipmentName] ??
    perkNameOverridesLower[equipmentName.toLowerCase()];
  const fileName = nameId ?? override ?? normalized;
  return fileName || null;
};

export function getEquipmentIconPath(
  equipmentName?: string,
  isAilment = false,
): string | null {
  const fileName = getEquipmentFileName(equipmentName);
  if (!fileName) {
    return null;
  }
  if (isAilment) {
    return `assets/art/Ailments/Ailments/${fileName}.png`;
  }
  return `assets/art/Public/Public/Food/${fileName}.png`;
}

export function getEquipmentAbilityText(equipmentName?: string): string | null {
  if (!equipmentName) {
    return null;
  }
  return equipmentAbilityMap.get(equipmentName) ?? null;
}

export function getAllEquipmentNames(): string[] {
  return [...equipmentNames];
}

const packNameToPetMap: Record<string, string> = {
  Turtle: 'Turtle',
  Golden: 'Golden Retriever',
  Puppy: 'Puppy',
  Star: 'Starfish',
  Unicorn: 'Unicorn',
  Danger: 'Blue Whale',
  Custom: 'White Tiger',
};

export function getPackIconPath(packName?: string): string | null {
  if (!packName || packName === 'Add Custom Pack') {
    return null;
  }
  const petName = packNameToPetMap[packName];
  if (petName) {
    return getPetIconPath(petName);
  }
  // For custom packs (user-created), use White Tiger as default
  return getPetIconPath('White Tiger');
}
