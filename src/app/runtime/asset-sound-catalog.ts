import { getPetSoundLookupInfo } from './asset-catalog';

interface PetSoundMapData {
  byNameId?: Record<string, string>;
  byPetId?: Record<string, string>;
}

interface PetSoundCatalog {
  byNameId: Map<string, string>;
  byPetId: Map<string, string>;
}

let petSoundCatalogPromise: Promise<PetSoundCatalog> | null = null;

async function loadPetSoundCatalog(): Promise<PetSoundCatalog> {
  if (!petSoundCatalogPromise) {
    petSoundCatalogPromise = import('assets/data/pet-sounds.json').then(
      (module) => {
        const raw =
          (module as { default?: PetSoundMapData }).default ??
          (module as PetSoundMapData) ??
          {};
        return {
          byNameId: new Map<string, string>(Object.entries(raw.byNameId ?? {})),
          byPetId: new Map<string, string>(Object.entries(raw.byPetId ?? {})),
        };
      },
    );
  }

  return petSoundCatalogPromise;
}

export async function getPetSoundPath(
  petName?: string,
): Promise<string | null> {
  if (!petName) {
    return null;
  }

  const lookupInfo = getPetSoundLookupInfo(petName);
  if (!lookupInfo) {
    return null;
  }

  const catalog = await loadPetSoundCatalog();
  const byNameIdFileName = lookupInfo.nameId
    ? catalog.byNameId.get(lookupInfo.nameId)
    : null;
  if (byNameIdFileName) {
    return `assets/sounds/pets/${byNameIdFileName}`;
  }

  const byPetIdFileName = lookupInfo.petId
    ? catalog.byPetId.get(lookupInfo.petId)
    : null;
  return byPetIdFileName ? `assets/sounds/pets/${byPetIdFileName}` : null;
}
