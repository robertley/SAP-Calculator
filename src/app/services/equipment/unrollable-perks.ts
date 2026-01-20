export const UNROLLABLE_PERK_NAMES = new Set<string>([
    'Mild Chili',
    'Melon Slice',
    'Coconut',
    'Golden Egg',
    'Skewer',
    'Guava',
    'Eucalyptus',
    'Rambutan'
]);

export const isUnrollablePerk = (equipment?: { name?: string; tier?: number } | null): boolean => {
    if (!equipment) {
        return true;
    }
    const tier = equipment.tier ?? 1;
    if (tier >= 7) {
        return true;
    }
    return UNROLLABLE_PERK_NAMES.has(equipment.name ?? '');
};
