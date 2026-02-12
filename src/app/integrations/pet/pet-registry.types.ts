import { Pet } from 'app/domain/entities/pet.class';

export type PetConstructor = new (...args: unknown[]) => Pet;
export type PetRegistryMap = Record<string, unknown>;
