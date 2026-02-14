import { Pet } from './pet.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { Toy } from './toy.class';
import { GameService } from 'app/runtime/state/game.service';
import { getOpponent } from 'app/runtime/player-opponent';
import { alive as playerAlive, checkPetsAlive as checkPetsAliveImpl, createDeathLog as createDeathLogImpl, handleDeath as handleDeathImpl, removeDeadPets as removeDeadPetsImpl, resetJumpedFlags as resetJumpedFlagsImpl, resetPets as resetPetsImpl } from './player/player-lifecycle';
import { makeRoomForSlot as makeRoomForSlotImpl, onionCheck as onionCheckImpl, pushBackwardFromSlot as pushBackwardFromSlotImpl, pushForwardFromSlot as pushForwardFromSlotImpl, pushPetsForward as pushPetsForwardImpl } from './player/player-movement';
import { summonPet as summonPetImpl, transformPet as transformPetImpl } from './player/player-summon';
import { PlayerSummonFacade } from './player/player-summon-facade';


export class Player extends PlayerSummonFacade {
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
  hardToy: Toy | null = null;
  brokenToy: Toy | null = null;
  brokenHardToy: Toy | null = null;
  originalToy: Toy | null = null;
  originalHardToy: Toy | null = null;

  trumpets: number = 0;
  spawnedGoldenRetiever: boolean = false;
  summonedBoatThisBattle: boolean = false;
  public isOpponent: boolean = false;
  public allPets: boolean = false;
  public tokenPets: boolean = false;
  public gold: number = 0;
  public pendingGoldFromMimic: number = 0;
  public futureShopBuffs: Map<number, { attack: number; health: number }> =
    new Map();

  cannedAilments: string[] = [];

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected gameService: GameService,
  ) {
    super();
  }

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

  get opponent() {
    return getOpponent(this.gameService.gameApi, this);
  }
}





