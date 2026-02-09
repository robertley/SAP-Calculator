import { Pet } from '../pet.class';
import {
  getAll as getAllImpl,
  getFurthestUpPet as getFurthestUpPetImpl,
  getFurthestUpPets as getFurthestUpPetsImpl,
  getHighestAttackPet as getHighestAttackPetImpl,
  getHighestAttackPets as getHighestAttackPetsImpl,
  getHighestHealthPet as getHighestHealthPetImpl,
  getHighestHealthPets as getHighestHealthPetsImpl,
  getHighestTierPets as getHighestTierPetsImpl,
  getLastPet as getLastPetImpl,
  getLastPets as getLastPetsImpl,
  getLowestAttackPet as getLowestAttackPetImpl,
  getLowestAttackPets as getLowestAttackPetsImpl,
  getLowestHealthPet as getLowestHealthPetImpl,
  getLowestHealthPets as getLowestHealthPetsImpl,
  getMiddleFriend as getMiddleFriendImpl,
  getOppositeEnemyPet as getOppositeEnemyPetImpl,
  getPetsWithinXSpaces as getPetsWithinXSpacesImpl,
  getRandomEnemyPetsWithSillyFallback as getRandomEnemyPetsWithSillyFallbackImpl,
  getRandomLivingPet as getRandomLivingPetImpl,
  getRandomLivingPets as getRandomLivingPetsImpl,
  getRandomPet as getRandomPetImpl,
  getRandomPets as getRandomPetsImpl,
  getPetsWithEquipmentWithSillyFallback as getPetsWithEquipmentWithSillyFallbackImpl,
  getSpecificPet as getSpecificPetImpl,
  getStrongestPet as getStrongestPetImpl,
  getThis as getThisImpl,
  getTierXOrLowerPet as getTierXOrLowerPetImpl,
  nearestPetsAhead as nearestPetsAheadImpl,
  nearestPetsBehind as nearestPetsBehindImpl,
  PetRandomResult,
} from './player-targeting';
import {
  getPetAtPosition as getPetAtPositionImpl,
  getPetsWithEquipment as getPetsWithEquipmentImpl,
  getPetsWithoutEquipment as getPetsWithoutEquipmentImpl,
  getManticoreMult as getManticoreMultImpl,
} from './player-utils';
import type { PlayerLike } from './player-like.types';

export abstract class PlayerTargetingFacade {
  abstract get petArray(): Pet[];

  getRandomPet(
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    notFiftyFifty?: boolean,
    callingPet?: Pet,
    includeOpponent?: boolean,
  ): PetRandomResult {
    return getRandomPetImpl(
      this as unknown as PlayerLike,
      excludePets,
      donut,
      blueberry,
      notFiftyFifty,
      callingPet,
      includeOpponent,
    );
  }

  getRandomPets(
    amt: number,
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    callingPet?: Pet,
    includeOpponent?: boolean,
  ): { pets: Pet[]; random: boolean } {
    return getRandomPetsImpl(
      this as unknown as PlayerLike,
      amt,
      excludePets,
      donut,
      blueberry,
      callingPet,
      includeOpponent,
    );
  }

  getRandomEnemyPetsWithSillyFallback(
    amt: number,
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getRandomEnemyPetsWithSillyFallbackImpl(
      this as unknown as PlayerLike,
      amt,
      excludePets,
      donut,
      blueberry,
      callingPet,
    );
  }

  getPetsWithEquipmentWithSillyFallback(
    equipmentName: string,
    callingPet?: Pet,
  ): Pet[] {
    return getPetsWithEquipmentWithSillyFallbackImpl(
      this as unknown as PlayerLike,
      equipmentName,
      callingPet,
    );
  }

  getRandomLivingPets(amt: number): { pets: Pet[]; random: boolean } {
    return getRandomLivingPetsImpl(this as unknown as PlayerLike, amt);
  }

  getAll(
    includeOpponent: boolean,
    callingPet?: Pet,
    excludeSelf?: boolean,
  ): { pets: Pet[]; random: boolean } {
    return getAllImpl(
      this as unknown as PlayerLike,
      includeOpponent,
      callingPet,
      excludeSelf,
    );
  }

  getPetsWithEquipment(equipmentName: string): Pet[] {
    return getPetsWithEquipmentImpl(this as unknown as PlayerLike, equipmentName);
  }

  getPetsWithoutEquipment(equipmentName: string): Pet[] {
    return getPetsWithoutEquipmentImpl(this as unknown as PlayerLike, equipmentName);
  }

  getPetAtPosition(position: number): Pet | null {
    return getPetAtPositionImpl(this as unknown as PlayerLike, position);
  }

  getMiddleFriend(callingPet?: Pet): PetRandomResult {
    return getMiddleFriendImpl(this as unknown as PlayerLike, callingPet);
  }

  getLastPet(excludePets?: Pet[], callingPet?: Pet): PetRandomResult {
    return getLastPetImpl(this as unknown as PlayerLike, excludePets, callingPet);
  }

  getLastPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getLastPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  getHighestHealthPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getHighestHealthPetImpl(
      this as unknown as PlayerLike,
      excludePet,
      callingPet,
    );
  }

  getHighestAttackPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getHighestAttackPetImpl(
      this as unknown as PlayerLike,
      excludePet,
      callingPet,
    );
  }

  getHighestAttackPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getHighestAttackPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  getLowestAttackPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getLowestAttackPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  getLowestAttackPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getLowestAttackPetImpl(
      this as unknown as PlayerLike,
      excludePet,
      callingPet,
    );
  }

  getLowestHealthPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getLowestHealthPetImpl(
      this as unknown as PlayerLike,
      excludePet,
      callingPet,
    );
  }

  getLowestHealthPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getLowestHealthPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  getHighestHealthPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getHighestHealthPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  getHighestTierPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getHighestTierPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  getTierXOrLowerPet(
    tier: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): PetRandomResult {
    return getTierXOrLowerPetImpl(
      this as unknown as PlayerLike,
      tier,
      excludePets,
      callingPet,
    );
  }

  get furthestUpPet(): Pet | null {
    for (const pet of this.petArray) {
      if (pet.alive) {
        return pet;
      }
    }
    return null;
  }

  getFurthestUpPet(callingPet?: Pet, excludePets?: Pet[]): PetRandomResult {
    return getFurthestUpPetImpl(
      this as unknown as PlayerLike,
      callingPet,
      excludePets,
    );
  }

  getFurthestUpPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getFurthestUpPetsImpl(
      this as unknown as PlayerLike,
      count,
      excludePets,
      callingPet,
    );
  }

  nearestPetsBehind(
    amt: number,
    callingPet: Pet,
    excludePets?: Pet[],
  ): { pets: Pet[]; random: boolean } {
    return nearestPetsBehindImpl(
      this as unknown as PlayerLike,
      amt,
      callingPet,
      excludePets,
    );
  }

  getThis(callingPet: Pet): PetRandomResult {
    return getThisImpl(this as unknown as PlayerLike, callingPet);
  }

  getSpecificPet(callingPet: Pet, target: Pet): PetRandomResult {
    return getSpecificPetImpl(this as unknown as PlayerLike, callingPet, target);
  }

  nearestPetsAhead(
    amt: number,
    callingPet: Pet,
    excludePets?: Pet[],
    includeOpponent?: boolean,
    excludeEquipment?: string,
  ): { pets: Pet[]; random: boolean } {
    return nearestPetsAheadImpl(
      this as unknown as PlayerLike,
      amt,
      callingPet,
      excludePets,
      includeOpponent,
      excludeEquipment,
    );
  }

  getStrongestPet(callingPet?: Pet): PetRandomResult {
    return getStrongestPetImpl(this as unknown as PlayerLike, callingPet);
  }

  getManticoreMult(): number[] {
    return getManticoreMultImpl(this as unknown as PlayerLike);
  }

  getPetsWithinXSpaces(
    callingPet: Pet,
    range: number,
  ): { pets: Pet[]; random: boolean } {
    return getPetsWithinXSpacesImpl(this as unknown as PlayerLike, callingPet, range);
  }

  getOppositeEnemyPet(callingPet: Pet): PetRandomResult {
    return getOppositeEnemyPetImpl(this as unknown as PlayerLike, callingPet);
  }

  getRandomLivingPet(excludePets?: Pet[]): PetRandomResult {
    return getRandomLivingPetImpl(this as unknown as PlayerLike, excludePets);
  }
}

