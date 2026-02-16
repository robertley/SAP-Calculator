import { Equipment } from '../equipment.class';
import { Pet } from '../pet.class';
import type { Player } from '../player.class';
import type { PlayerLike } from './player-like.types';
import { PlayerToyFacade } from './player-toy-facade';
import {
  checkGoldenSpawn as checkGoldenSpawnImpl,
  gainTrumpets as gainTrumpetsImpl,
  resolveTrumpetGainTarget as resolveTrumpetGainTargetImpl,
  spendTrumpets as spendTrumpetsImpl,
} from './player-trumpets';

export abstract class PlayerTrumpetFacade extends PlayerToyFacade {
  resolveTrumpetGainTarget(
    callingPet?: Pet,
  ): { player: Player; random: boolean } {
    return resolveTrumpetGainTargetImpl(this as unknown as PlayerLike, callingPet);
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
      this as unknown as PlayerLike,
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
    spendTrumpetsImpl(
      this as unknown as PlayerLike,
      amt,
      pet,
      this.logService,
      pteranodon,
    );
  }

  checkGoldenSpawn() {
    checkGoldenSpawnImpl(
      this as unknown as PlayerLike,
      this.abilityService,
      this.logService,
      this.gameService,
    );
  }
}

