import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Pet } from '../pet.class';
import {
  pushPet as pushPetImpl,
  pushPetToBack as pushPetToBackImpl,
  pushPetToFront as pushPetToFrontImpl,
} from './player-movement';
import type { PlayerLike } from './player-like.types';
import { PlayerTargetingFacade } from './player-targeting-facade';

export abstract class PlayerMovementFacade extends PlayerTargetingFacade {
  protected abstract logService: LogService;
  protected abstract abilityService: AbilityService;

  pushPetToFront(pet: Pet, jump = false) {
    pushPetToFrontImpl(
      this as unknown as PlayerLike,
      pet,
      jump,
      this.logService,
      this.abilityService,
    );
  }

  pushPetToBack(pet: Pet) {
    pushPetToBackImpl(
      this as unknown as PlayerLike,
      pet,
      this.logService,
      this.abilityService,
    );
  }

  pushPet(pet: Pet, spaces = 1, jump?: boolean) {
    pushPetImpl(
      this as unknown as PlayerLike,
      pet,
      spaces,
      jump,
      this.logService,
      this.abilityService,
    );
  }
}

