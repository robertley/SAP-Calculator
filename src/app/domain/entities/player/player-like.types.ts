import type { Pet } from '../pet.class';
import type { Toy } from '../toy.class';

export interface PetLike {
  name: string;
  equipment?: { name?: string; equipmentClass?: string; uses?: number } | null;
}

export interface PlayerLike {
  pet0?: Pet;
  pet1?: Pet;
  pet2?: Pet;
  pet3?: Pet;
  pet4?: Pet;
  petArray: Pet[];
  opponent: PlayerLike;
  furthestUpPet: Pet | null;
  toy: Toy | null;
  brokenToy: Toy | null;
  trumpets: number;
  spawnedGoldenRetiever: boolean;
  getPet(index: number): Pet | undefined;
  setPet(index: number, pet: Pet, init?: boolean): void;
}
