const petNameOverrides: Record<string, string> = {
  'Beluga Whale': 'WhiteWhale',
  'Great One': 'Cthulu',
  'Small One': 'BabyCthulhu',
  'Abomination': 'Shoggoth',
  'Visitor': 'Xenomorph',
  'Swordfish': 'SwordFish'
};

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
  const mapped = petNameOverrides[petName] ?? petName;
  const normalized = normalize(mapped);
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
  const fileName = normalize(toyName);
  if (!fileName) {
    return null;
  }
  return `/assets/art/Public/Public/Toys/${fileName}.png`;
}

export function getEquipmentIconPath(equipmentName?: string, isAilment = false): string | null {
  if (!equipmentName) {
    return null;
  }
  const fileName = normalize(equipmentName);
  if (!fileName) {
    return null;
  }
  if (isAilment) {
    return `/assets/art/Ailments/Ailments/${fileName}.png`;
  }
  return `/assets/art/Public/Public/Food/${fileName}.png`;
}
