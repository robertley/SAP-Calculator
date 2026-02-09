import { Pet } from '../pet.class';

export interface PetRandomResult {
  pet: Pet | null;
  random: boolean;
}

export interface PetsRandomResult {
  pets: Pet[];
  random: boolean;
}
