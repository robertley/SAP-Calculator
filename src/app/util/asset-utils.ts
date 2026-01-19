import * as petsJson from "../files/pets.json";
import * as toysJson from "../files/toys.json";
import * as perksJson from "../files/perks.json";

interface NameIdEntry {
  Name?: string;
  NameId?: string;
}

const getNameList = (entries: NameIdEntry[]): string[] =>
  entries.map((entry) => entry?.Name).filter((name): name is string => Boolean(name));

const petNameOverrides: Record<string, string> = {
  'Beluga Whale': 'WhiteWhale',
  'Great One': 'Cthulu',
  'Small One': 'BabyCthulhu',
  'Abomination': 'Shoggoth',
  'Visitor': 'Xenomorph',
  'Swordfish': 'SwordFish',
  'Doberman': 'DobermanDog',
  'Highland Cow': 'HighlandCow',
  'Sabertooth Tiger': 'SaberToothTiger'
};

export const perkNameOverrides: Record<string, string> = {
  'Corncob': 'Corn',
  'Cake Slice': 'BirthdayCakeSlice',
  'Peanut Butter': 'PeanutButter',
  'Mana Potion': 'ManaPotion',
  'Faint Bread': 'DeadBread',
  'Kiwifruit': 'Kiwi',
  'Eggplant': 'EggPlant',
  'Rice': 'RiceBall',
  'Donut': 'Doughnut',
  'Cherry': 'Cherries',
  'Melon Slice': 'WaterMelon',
  'Cold': 'Frozen',
  'Crisp': 'Burn',
  'Dazed': 'Deaf',
  'Icky': 'Acid',
  'Inked': 'Ink',
  'Spooked': 'Scared',
  'Sleepy': 'Drowsy',
  'Webbed': 'Web',
  'Cursed': 'Curse',
  'Silly': 'Silly',
  'Bloated': 'Bloated'
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

const petNameIds = buildNameIdMap(
  (
    (petsJson as unknown as { default?: NameIdEntry[] }).default ??
    (petsJson as unknown as NameIdEntry[])
  ) ?? [],
);
const petNames = getNameList(
  (
    (petsJson as unknown as { default?: NameIdEntry[] }).default ??
    (petsJson as unknown as NameIdEntry[])
  ) ?? [],
);
const toyNameIds = buildNameIdMap(
  (
    (toysJson as unknown as { default?: NameIdEntry[] }).default ??
    (toysJson as unknown as NameIdEntry[])
  ) ?? [],
);
const toyNames = getNameList(
  (
    (toysJson as unknown as { default?: NameIdEntry[] }).default ??
    (toysJson as unknown as NameIdEntry[])
  ) ?? [],
);
const equipmentNameIds = buildNameIdMap(
  (
    (perksJson as unknown as { default?: NameIdEntry[] }).default ??
    (perksJson as unknown as NameIdEntry[])
  ) ?? [],
);
const equipmentNames = getNameList(
  (
    (perksJson as unknown as { default?: NameIdEntry[] }).default ??
    (perksJson as unknown as NameIdEntry[])
  ) ?? [],
);

const normalize = (name: string): string => {
  if (!name) {
    return "";
  }
  return name.replace(/[^a-zA-Z0-9]/g, "");
};

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
  return `/assets/art/Public/Public/Pets/${fileName}.png`;
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
  return `/assets/art/Public/Public/Toys/${fileName}.png`;
}

export function getAllToyNames(): string[] {
  return [...toyNames];
}

export function getEquipmentIconPath(equipmentName?: string, isAilment = false): string | null {
  if (!equipmentName) {
    return null;
  }
  const nameId = equipmentNameIds.get(equipmentName);
  const fileName = nameId ?? perkNameOverrides[equipmentName] ?? normalize(equipmentName);
  if (!fileName) {
    return null;
  }
  if (isAilment) {
    return `/assets/art/Ailments/Ailments/${fileName}.png`;
  }
  return `/assets/art/Public/Public/Food/${fileName}.png`;
}

export function getAllEquipmentNames(): string[] {
  return [...equipmentNames];
}

const packNameToPetMap: Record<string, string> = {
  'Turtle': 'Turtle',
  'Golden': 'Golden Retriever',
  'Puppy': 'Puppy',
  'Star': 'Starfish',
  'Unicorn': 'Unicorn',
  'Danger': 'Blue Whale',
  'Custom': 'White Tiger'
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
