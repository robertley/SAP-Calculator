import { Pet } from '../pet.class';
import type { PlayerLike } from './player-like.types';
import { PlayerTrumpetFacade } from './player-trumpet-facade';
import {
  summonPetBehind as summonPetBehindImpl,
  summonPetInFront as summonPetInFrontImpl,
} from './player-summon';

export abstract class PlayerSummonFacade extends PlayerTrumpetFacade {
  summonPetInFront(
    summoner: Pet,
    summonedPet: Pet,
  ): { success: boolean; randomEvent: boolean } {
    return summonPetInFrontImpl(
      this as unknown as PlayerLike,
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
      this as unknown as PlayerLike,
      summoner,
      summonedPet,
      this.logService,
      this.abilityService,
      this.gameService,
    );
  }
}

