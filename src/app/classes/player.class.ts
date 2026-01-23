import { Pet } from './pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Toy } from './toy.class';
import { Equipment } from './equipment.class';
import { GameService } from 'app/services/game.service';
import { getOpponent } from 'app/util/helper-functions';
import { alive as playerAlive, checkPetsAlive as checkPetsAliveImpl, createDeathLog as createDeathLogImpl, handleDeath as handleDeathImpl, removeDeadPets as removeDeadPetsImpl, resetJumpedFlags as resetJumpedFlagsImpl, resetPets as resetPetsImpl } from './player/player-lifecycle';
import { getPetAtPosition as getPetAtPositionImpl, getPetsWithEquipment as getPetsWithEquipmentImpl, getPetsWithoutEquipment as getPetsWithoutEquipmentImpl, getManticoreMult as getManticoreMultImpl } from './player/player-utils';
import { getAll as getAllImpl, getFurthestUpPet as getFurthestUpPetImpl, getFurthestUpPets as getFurthestUpPetsImpl, getHighestAttackPet as getHighestAttackPetImpl, getHighestAttackPets as getHighestAttackPetsImpl, getHighestHealthPet as getHighestHealthPetImpl, getHighestHealthPets as getHighestHealthPetsImpl, getHighestTierPets as getHighestTierPetsImpl, getLastPet as getLastPetImpl, getLastPets as getLastPetsImpl, getLowestAttackPet as getLowestAttackPetImpl, getLowestAttackPets as getLowestAttackPetsImpl, getLowestHealthPet as getLowestHealthPetImpl, getLowestHealthPets as getLowestHealthPetsImpl, getMiddleFriend as getMiddleFriendImpl, getOppositeEnemyPet as getOppositeEnemyPetImpl, getPetsWithinXSpaces as getPetsWithinXSpacesImpl, getRandomLivingPet as getRandomLivingPetImpl, getRandomLivingPets as getRandomLivingPetsImpl, getRandomPet as getRandomPetImpl, getRandomPets as getRandomPetsImpl, getRandomEnemyPetsWithSillyFallback as getRandomEnemyPetsWithSillyFallbackImpl, getPetsWithEquipmentWithSillyFallback as getPetsWithEquipmentWithSillyFallbackImpl, PetRandomResult, getSpecificPet as getSpecificPetImpl, getStrongestPet as getStrongestPetImpl, getThis as getThisImpl, getTierXOrLowerPet as getTierXOrLowerPetImpl, nearestPetsAhead as nearestPetsAheadImpl, nearestPetsBehind as nearestPetsBehindImpl } from './player/player-targeting';
import { makeRoomForSlot as makeRoomForSlotImpl, onionCheck as onionCheckImpl, pushBackwardFromSlot as pushBackwardFromSlotImpl, pushForwardFromSlot as pushForwardFromSlotImpl, pushPet as pushPetImpl, pushPetToBack as pushPetToBackImpl, pushPetToFront as pushPetToFrontImpl, pushPetsForward as pushPetsForwardImpl } from './player/player-movement';
import { summonPet as summonPetImpl, summonPetBehind as summonPetBehindImpl, summonPetInFront as summonPetInFrontImpl, transformPet as transformPetImpl } from './player/player-summon';
import { breakToy as breakToyImpl, setToy as setToyImpl } from './player/player-toys';
import { checkGoldenSpawn as checkGoldenSpawnImpl, gainTrumpets as gainTrumpetsImpl, resolveTrumpetGainTarget as resolveTrumpetGainTargetImpl, spendTrumpets as spendTrumpetsImpl } from './player/player-trumpets';


export class Player {
  pet0?: Pet;
  pet1?: Pet;
  pet2?: Pet;
  pet3?: Pet;
  pet4?: Pet;

  orignalPet0?: Pet;
  orignalPet1?: Pet;
  orignalPet2?: Pet;
  orignalPet3?: Pet;
  orignalPet4?: Pet;

  pack:
    | 'Turtle'
    | 'Puppy'
    | 'Star'
    | 'Golden'
    | 'Custom'
    | 'Unicorn'
    | 'Danger' = 'Turtle';

  toy: Toy | null = null;
  brokenToy: Toy | null = null;
  originalToy: Toy | null = null;

  trumpets: number = 0;
  spawnedGoldenRetiever: boolean = false;
  summonedBoatThisBattle: boolean = false;
  public isOpponent: boolean = false;
  public allPets: boolean = false;
  public tokenPets: boolean = false;

  cannedAilments: string[] = [];

  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
  ) {}

  alive(): boolean {
    return playerAlive(this);
  }

  resetPets() {
    resetPetsImpl(this);
  }

  resetJumpedFlags() {
    resetJumpedFlagsImpl(this);
  }

  setPet(index: number, pet: Pet, init = false) {
    let oldPet = this.getPet(index);
    if (oldPet != null) {
      // oldPet.savedPosition = null;
    }
    if (index == 0) {
      this.pet0 = pet;
      if (pet != null) {
        this.pet0.savedPosition = 0;
      }
      if (init) {
        this.orignalPet0 = pet;
      }
    }
    if (index == 1) {
      this.pet1 = pet;
      if (pet != null) {
        this.pet1.savedPosition = 1;
      }
      if (init) {
        this.orignalPet1 = pet;
      }
    }
    if (index == 2) {
      this.pet2 = pet;
      if (pet != null) {
        this.pet2.savedPosition = 2;
      }
      if (init) {
        this.orignalPet2 = pet;
      }
    }
    if (index == 3) {
      this.pet3 = pet;
      if (pet != null) {
        this.pet3.savedPosition = 3;
      }
      if (init) {
        this.orignalPet3 = pet;
      }
    }
    if (index == 4) {
      this.pet4 = pet;
      if (pet != null) {
        this.pet4.savedPosition = 4;
      }
      if (init) {
        this.orignalPet4 = pet;
      }
    }
    if (init && pet != null) {
      pet.originalSavedPosition = pet.savedPosition;
    }
  }

  getPet(index: number) {
    switch (index) {
      case 0:
        return this.pet0;
      case 1:
        return this.pet1;
      case 2:
        return this.pet2;
      case 3:
        return this.pet3;
      case 4:
        return this.pet4;
      default:
        return undefined;
    }
  }

  pushPetsForward() {
    pushPetsForwardImpl(this);
  }

  //TO DO: This needs fix, might be useless
  onionCheck() {
    onionCheckImpl(this);
  }

  summonPet(
    spawnPet: Pet,
    position: number,
    fly = false,
    summoner?: Pet,
  ): { success: boolean; randomEvent: boolean } {
    return summonPetImpl(
      this,
      spawnPet,
      position,
      fly,
      summoner,
      this.logService,
      this.abilityService,
      this.gameService,
    );
  }

  transformPet(originalPet: Pet, newPet: Pet): void {
    transformPetImpl(
      this,
      originalPet,
      newPet,
      this.abilityService,
      this.gameService,
    );
  }
  /**
   *@returns if able to make space
   */
  pushForwardFromSlot(slot: number) {
    return pushForwardFromSlotImpl(this, slot);
  }
  /**
   * @returns if able to make space
   */
  pushBackwardFromSlot(slot: number) {
    return pushBackwardFromSlotImpl(this, slot);
  }
  makeRoomForSlot(slot: number) {
    makeRoomForSlotImpl(this, slot);
  }

  get petArray(): Pet[] {
    let petArray: Pet[] = [];

    if (this.pet0 != null) {
      petArray.push(this.pet0);
    }

    if (this.pet1 != null) {
      petArray.push(this.pet1);
    }

    if (this.pet2 != null) {
      petArray.push(this.pet2);
    }

    if (this.pet3 != null) {
      petArray.push(this.pet3);
    }

    if (this.pet4 != null) {
      petArray.push(this.pet4);
    }

    return petArray;
  }

  handleDeath(pet: Pet) {
    handleDeathImpl(pet, this.logService);
  }

  checkPetsAlive() {
    checkPetsAliveImpl(this, this.logService);
  }

  removeDeadPets(): boolean {
    return removeDeadPetsImpl(this, this.abilityService);
  }

  createDeathLog(pet: Pet) {
    createDeathLogImpl(pet, this.logService);
  }

  /**
   * During the turn life cycle a pet may have fainted but not removed.
   * Those pets cannot be returned from this method.
   * @param excludePet pet we want to exclude from being chosen
   * @returns Pet or null
   */
  getRandomPet(
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    notFiftyFifty?: boolean,
    callingPet?: Pet,
    includeOpponent?: boolean,
  ): PetRandomResult {
    return getRandomPetImpl(
      this,
      excludePets,
      donut,
      blueberry,
      notFiftyFifty,
      callingPet,
      includeOpponent,
    );
  }

  /**
   * Will prioritize donut or blueberry pets. does not expect both arguments to be true.
   * @param amt amount of pets to return
   * @param excludePets pets to exclude from the random selection
   * @param donut find donut pets first
   * @param blueberry fine blueberry pets first
   * @returns pet array
   */
  getRandomPets(
    amt: number,
    excludePets?: Pet[],
    donut?: boolean,
    blueberry?: boolean,
    callingPet?: Pet,
    includeOpponent?: boolean,
  ): { pets: Pet[]; random: boolean } {
    return getRandomPetsImpl(
      this,
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
      this,
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
      this,
      equipmentName,
      callingPet,
    );
  }

  /**
   * Returns multiple random living pets from both teams with donut/blueberry prioritization.
   * Calls getRandomLivingPet in a loop, same relationship as getRandomPets/getRandomPet.
   * @param amt Number of pets to return
   * @returns Array of random living pets from both teams
   */
  getRandomLivingPets(amt: number): { pets: Pet[]; random: boolean } {
    return getRandomLivingPetsImpl(this, amt);
  }

  /**
   * Returns all living pets with optional opponent inclusion and Silly ailment handling.
   * @param includeOpponent Whether to include opponent's pets
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Array of all living pets with random boolean
   */
  getAll(
    includeOpponent: boolean,
    callingPet?: Pet,
    excludeSelf?: boolean,
  ): { pets: Pet[]; random: boolean } {
    return getAllImpl(this, includeOpponent, callingPet, excludeSelf);
  }

  getPetsWithEquipment(equipmentName: string): Pet[] {
    return getPetsWithEquipmentImpl(this, equipmentName);
  }
  getPetsWithoutEquipment(equipmentName: string): Pet[] {
    return getPetsWithoutEquipmentImpl(this, equipmentName);
  }

  getPetAtPosition(position: number): Pet | null {
    return getPetAtPositionImpl(this, position);
  }

  getMiddleFriend(callingPet?: Pet): PetRandomResult {
    return getMiddleFriendImpl(this, callingPet);
  }

  getLastPet(excludePets?: Pet[], callingPet?: Pet): PetRandomResult {
    return getLastPetImpl(this, excludePets, callingPet);
  }

  /**
   * Returns multiple pets from the back of the formation (rightmost positions first)
   * @param count Number of pets to return
   * @param excludePets Optional array of pets to exclude from selection
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Array of pets from back positions
   */
  getLastPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getLastPetsImpl(this, count, excludePets, callingPet);
  }

  /**
   * Returns highest health pet. Returns a random pet of highest health if there are multiple.
   * @param excludePet
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns
   */
  getHighestHealthPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getHighestHealthPetImpl(this, excludePet, callingPet);
  }

  /**
   * Returns highest attack pet. Returns a random pet of highest attack if there are multiple.
   * @param excludePet
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns
   */
  getHighestAttackPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getHighestAttackPetImpl(this, excludePet, callingPet);
  }

  getHighestAttackPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getHighestAttackPetsImpl(this, count, excludePets, callingPet);
  }

  getLowestAttackPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getLowestAttackPetsImpl(this, count, excludePets, callingPet);
  }

  /**
   * Returns lowest attack pet. Returns a random pet of lowest attack if there are multiple.
   * @param excludePet
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns
   */
  getLowestAttackPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getLowestAttackPetImpl(this, excludePet, callingPet);
  }

  /**
   * Returns lowest health pet. Returns a random pet of lowest health if there are multiple. Will only return alive pets.
   * @param excludePet
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns
   */
  getLowestHealthPet(excludePet?: Pet, callingPet?: Pet): PetRandomResult {
    return getLowestHealthPetImpl(this, excludePet, callingPet);
  }

  /**
   * Returns multiple lowest health pets sorted by health (lowest first)
   * @param count Number of pets to return
   * @param excludePets Optional array of pets to exclude from selection
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Array of pets sorted by health (lowest first)
   */
  getLowestHealthPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getLowestHealthPetsImpl(this, count, excludePets, callingPet);
  }

  /**
   * Returns multiple highest health pets sorted by health (highest first)
   * @param count Number of pets to return
   * @param excludePets Optional array of pets to exclude from selection
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Array of pets sorted by health (highest first)
   */
  getHighestHealthPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getHighestHealthPetsImpl(this, count, excludePets, callingPet);
  }

  /**
   * Returns multiple highest tier pets sorted by tier (highest first)
   * @param count Number of pets to return
   * @param excludePets Optional array of pets to exclude from selection
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Array of pets sorted by tier (highest first)
   */
  getHighestTierPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getHighestTierPetsImpl(this, count, excludePets, callingPet);
  }
  /**
   * Returns a pet that's tier X or lower
   * @param tier Maximum tier level (inclusive)
   * @param excludePets Optional array of pets to exclude from selection
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Pet object with random boolean
   */
  getTierXOrLowerPet(
    tier: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): PetRandomResult {
    return getTierXOrLowerPetImpl(this, tier, excludePets, callingPet);
  }
  get furthestUpPet(): Pet | null {
    for (let pet of this.petArray) {
      if (pet.alive) {
        return pet;
      }
    }
    return null;
  }
  getFurthestUpPet(callingPet?: Pet, excludePets?: Pet[]): PetRandomResult {
    return getFurthestUpPetImpl(this, callingPet, excludePets);
  }

  /**
   * Returns multiple pets from the furthest up positions (front of the team)
   * @param count Number of pets to return
   * @param excludePets Optional array of pets to exclude from selection
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns Object with pets array and random boolean (for Silly compatibility)
   */
  getFurthestUpPets(
    count: number,
    excludePets?: Pet[],
    callingPet?: Pet,
  ): { pets: Pet[]; random: boolean } {
    return getFurthestUpPetsImpl(this, count, excludePets, callingPet);
  }

  /**
   * Returns pets behind the calling pet, starting from the position right behind it
   * @param amt Number of pets to return
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @param excludePets Optional array of pets to exclude from selection
   * @returns Array of pets behind the calling pet
   */
  nearestPetsBehind(
    amt: number,
    callingPet: Pet,
    excludePets?: Pet[],
  ): { pets: Pet[]; random: boolean } {
    return nearestPetsBehindImpl(this, amt, callingPet, excludePets);
  }

  /**
   * Returns the calling pet normally, but returns a random living pet when Silly is active
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @returns The calling pet or random pet if Silly is active
   */
  getThis(callingPet: Pet): PetRandomResult {
    return getThisImpl(this, callingPet);
  }
  getSpecificPet(callingPet: Pet, target: Pet): PetRandomResult {
    return getSpecificPetImpl(this, callingPet, target);
  }
  /**
   * Returns pets ahead of the calling pet, starting from the position right ahead of it
   * @param amt Number of pets to return
   * @param callingPet Pet calling this method (for Silly ailment detection)
   * @param excludePets Optional array of pets to exclude from selection
   * @param includeOpponent Whether to include opponent pets in targeting (default: false)
   * @returns Array of pets ahead of the calling pet
   */
  nearestPetsAhead(
    amt: number,
    callingPet: Pet,
    excludePets?: Pet[],
    includeOpponent?: boolean,
    excludeEquipment?: string,
  ): { pets: Pet[]; random: boolean } {
    return nearestPetsAheadImpl(
      this,
      amt,
      callingPet,
      excludePets,
      includeOpponent,
      excludeEquipment,
    );
  }

  breakToy(respawn = false) {
    breakToyImpl(
      this,
      respawn,
      this.logService,
      this.abilityService,
      this.gameService,
    );
  }

  setToy(toy: Toy) {
    setToyImpl(this, toy);
  }

  getStrongestPet(callingPet?: Pet): PetRandomResult {
    return getStrongestPetImpl(this, callingPet);
  }

  pushPetToFront(pet: Pet, jump = false) {
    pushPetToFrontImpl(this, pet, jump, this.logService, this.abilityService);
  }

  pushPetToBack(pet: Pet) {
    pushPetToBackImpl(this, pet, this.logService, this.abilityService);
  }

  pushPet(pet: Pet, spaces = 1, jump?: boolean) {
    pushPetImpl(this, pet, spaces, jump, this.logService, this.abilityService);
  }

  get opponent() {
    return getOpponent(this.gameService.gameApi, this);
  }

  resolveTrumpetGainTarget(callingPet?: Pet): {
    player: Player;
    random: boolean;
  } {
    return resolveTrumpetGainTargetImpl(this, callingPet);
  }

  gainTrumpets(
    amt: number,
    pet: Pet | Equipment,
    pteranodon?: boolean,
    pantherMultiplier?: number,
    cherry?: boolean,
    randomEvent?: boolean,
  ) {
    gainTrumpetsImpl(
      this,
      amt,
      pet,
      this.logService,
      pteranodon,
      pantherMultiplier,
      cherry,
      randomEvent,
    );
  }

  spendTrumpets(amt: number, pet: Pet, pteranodon?: boolean) {
    spendTrumpetsImpl(this, amt, pet, this.logService, pteranodon);
  }

  checkGoldenSpawn() {
    checkGoldenSpawnImpl(
      this,
      this.abilityService,
      this.logService,
      this.gameService,
    );
  }

  getManticoreMult(): number[] {
    return getManticoreMultImpl(this);
  }

  summonPetInFront(
    summoner: Pet,
    summonedPet: Pet,
  ): { success: boolean; randomEvent: boolean } {
    return summonPetInFrontImpl(
      this,
      summoner,
      summonedPet,
      this.logService,
      this.abilityService,
      this.gameService,
    );
  }

  summonPetBehind(
    summoner: Pet,
    summonedPet: Pet,
  ): { success: boolean; randomEvent: boolean } {
    return summonPetBehindImpl(
      this,
      summoner,
      summonedPet,
      this.logService,
      this.abilityService,
      this.gameService,
    );
  }

  /**
   * Get all pets within X spaces from the calling pet's position
   * Similar to Bear and Visitor targeting logic
   * @param callingPet Pet calling this method (for position and Silly ailment detection)
   * @param range Number of spaces to search within
   * @returns Object with pets array and random boolean (for Silly compatibility)
   */
  getPetsWithinXSpaces(
    callingPet: Pet,
    range: number,
  ): { pets: Pet[]; random: boolean } {
    return getPetsWithinXSpacesImpl(this, callingPet, range);
  }

  /**
   * Get enemy pet at calling pet's position with nearby search and Silly support
   * @param callingPet Pet making the call (for position and Silly detection)
   * @returns Object with pet and random boolean (for Silly compatibility)
   */
  getOppositeEnemyPet(callingPet: Pet): PetRandomResult {
    return getOppositeEnemyPetImpl(this, callingPet);
  }

  getRandomLivingPet(excludePets?: Pet[]): PetRandomResult {
    return getRandomLivingPetImpl(this, excludePets);
  }
}
