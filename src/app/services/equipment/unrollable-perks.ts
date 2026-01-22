import * as foodJson from '../../files/food.json';

interface FoodJsonEntry {
  Name?: string;
  Rollable?: boolean;
}

const rollablePerkNames = new Map<string, boolean>();
const foodEntries =
  (
    (foodJson as unknown as { default?: FoodJsonEntry[] }).default ??
    (foodJson as unknown as FoodJsonEntry[])
  ) ?? [];

for (const entry of foodEntries) {
  if (!entry?.Name) {
    continue;
  }
  rollablePerkNames.set(entry.Name, entry.Rollable === true);
}

export const isRollablePerk = (
  equipment?: { name?: string } | null,
): boolean => {
  if (!equipment?.name) {
    return false;
  }
  return rollablePerkNames.get(equipment.name) === true;
};

export const isUnrollablePerk = (
  equipment?: { name?: string } | null,
): boolean => {
  return !isRollablePerk(equipment);
};
