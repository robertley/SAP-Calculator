import * as petsJson from "../files/pets.json";
import * as toysJson from "../files/toys.json";
import * as perksJson from "../files/perks.json";

interface NameIdEntry {
  Name?: string;
  NameId?: string;
}

const petNameOverrides: Record<string, string> = {
  'Beluga Whale': 'WhiteWhale',
  'Great One': 'Cthulu',
  'Small One': 'BabyCthulhu',
  'Abomination': 'Shoggoth',
  'Visitor': 'Xenomorph',
  'Swordfish': 'SwordFish'
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
const toyNameIds = buildNameIdMap(
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
  const normalized = normalize(petName);
  return normalized || null;
}

export function getPetIconPath(petName?: string): string | null {
  const fileName = getPetIconFileName(petName);
  if (!fileName) {
    return null;
  }
  return `/assets/art/Public/Public/Pets/${fileName}.png`;
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

export function getEquipmentIconPath(equipmentName?: string, isAilment = false): string | null {
  if (!equipmentName) {
    return null;
  }
  const nameId = equipmentNameIds.get(equipmentName);
  const fileName = nameId ?? normalize(equipmentName);
  if (!fileName) {
    return null;
  }
  if (isAilment) {
    return `/assets/art/Ailments/Ailments/${fileName}.png`;
  }
  return `/assets/art/Public/Public/Food/${fileName}.png`;
}
