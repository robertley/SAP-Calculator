import { PetRegistryMap } from './pet-registry.types';
import { TURTLE_PET_REGISTRY } from './registries/pet-registry.turtle';
import { PUPPY_PET_REGISTRY } from './registries/pet-registry.puppy';
import { STAR_PET_REGISTRY } from './registries/pet-registry.star';
import { GOLDEN_PET_REGISTRY } from './registries/pet-registry.golden';
import { UNICORN_PET_REGISTRY } from './registries/pet-registry.unicorn';
import { DANGER_PET_REGISTRY } from './registries/pet-registry.danger';
import { CUSTOM_PET_REGISTRY } from './registries/pet-registry.custom';
import { HIDDEN_PET_REGISTRY } from './registries/pet-registry.hidden';

export const PET_REGISTRY: PetRegistryMap = {
  ...TURTLE_PET_REGISTRY,
  ...PUPPY_PET_REGISTRY,
  ...STAR_PET_REGISTRY,
  ...GOLDEN_PET_REGISTRY,
  ...UNICORN_PET_REGISTRY,
  ...DANGER_PET_REGISTRY,
  ...CUSTOM_PET_REGISTRY,
  ...HIDDEN_PET_REGISTRY,
};



