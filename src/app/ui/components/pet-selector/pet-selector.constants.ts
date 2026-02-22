export type SwallowedPetTarget =
  | 'pet'
  | 'abomination'
  | 'sarcastic'
  | 'abomination-beluga'
  | 'abomination-sarcastic'
  | 'parrot'
  | 'parrot-beluga'
  | 'parrot-abomination'
  | 'parrot-abomination-beluga'
  | 'abomination-parrot'
  | 'abomination-parrot-beluga'
  | 'abomination-parrot-abomination'
  | 'abomination-parrot-abomination-beluga'
  | 'parrot-abomination-parrot'
  | 'parrot-abomination-parrot-beluga'
  | 'parrot-abomination-parrot-abomination'
  | 'parrot-abomination-parrot-abomination-beluga';

export const PARROT_COPY_TARGETS = new Set<SwallowedPetTarget>([
  'parrot',
  'parrot-beluga',
  'parrot-abomination',
  'parrot-abomination-beluga',
  'abomination-parrot',
  'abomination-parrot-beluga',
  'abomination-parrot-abomination',
  'abomination-parrot-abomination-beluga',
  'parrot-abomination-parrot',
  'parrot-abomination-parrot-beluga',
  'parrot-abomination-parrot-abomination',
  'parrot-abomination-parrot-abomination-beluga',
]);

export const TIMES_HURT_SUPPORTED_PETS = new Set<string>(['sabertooth tiger', 'tuna']);

function toNormalizedPetName(petValue: unknown): string | null {
  if (typeof petValue === 'string') {
    const normalized = petValue.trim().toLowerCase();
    return normalized.length > 0 ? normalized : null;
  }
  if (
    petValue &&
    typeof petValue === 'object' &&
    typeof (petValue as { name?: unknown }).name === 'string'
  ) {
    const normalized = (petValue as { name: string }).name.trim().toLowerCase();
    return normalized.length > 0 ? normalized : null;
  }
  return null;
}

export function supportsTimesHurtPet(petValue: unknown): boolean {
  const normalizedName = toNormalizedPetName(petValue);
  if (!normalizedName) {
    return false;
  }
  if (TIMES_HURT_SUPPORTED_PETS.has(normalizedName)) {
    return true;
  }
  return normalizedName.includes('sabertooth');
}

export const TOKEN_PETS: string[] = [
  'Adult Flounder',
  'Angry Pygmy Hog',
  'Baby Urchin',
  'Bee',
  'Bus',
  'Butterfly',
  'Chick',
  'Chimera Goat',
  'Chimera Lion',
  'Chimera Snake',
  'Cooked Roach',
  'Cracked Egg',
  'Cuckoo Chick',
  'Daycrawler',
  'Dirty Rat',
  'Fairy Ball',
  'Fake Nessie',
  'Fire Pup',
  'Giant Eyes Dog',
  'Golden Retriever',
  'Good Dog',
  'Great One',
  'Head',
  'Lizard Tail',
  'Loyal Chinchilla',
  'Mimic Octopus',
  'Moby Dick',
  'Monty',
  'Nessie?',
  'Nest',
  'Quail',
  'Ram',
  'Rock',
  'Salmon',
  'Sleeping Gelada',
  'Smaller Slime',
  'Smaller Slug',
  'Smallest Slug',
  'Tand and Tand',
  'Young Phoenix',
  'Zombie Cricket',
  'Zombie Fly',
];

export const PARROT_COPY_ABOMINATION_SWALLOWED_FIELDS: string[] = (() => {
  const fields: string[] = [];
  for (let slot = 1; slot <= 3; slot++) {
    const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
    fields.push(base);
    fields.push(`${base}BelugaSwallowedPet`);
    fields.push(`${base}Level`);
    fields.push(`${base}TimesHurt`);
  }
  return fields;
})();

export const PARROT_COPY_ABOMINATION_PARROT_FIELDS: string[] = (() => {
  const fields: string[] = [];
  for (let slot = 1; slot <= 3; slot++) {
    const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
    fields.push(`${base}ParrotCopyPet`);
    fields.push(`${base}ParrotCopyPetBelugaSwallowedPet`);
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
      fields.push(innerBase);
      fields.push(`${innerBase}BelugaSwallowedPet`);
      fields.push(`${innerBase}Level`);
      fields.push(`${innerBase}TimesHurt`);
    }
  }
  return fields;
})();
