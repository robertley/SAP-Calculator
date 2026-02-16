import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { GameService } from 'app/runtime/state/game.service';
import { Toy } from '../toy.class';
import type { PlayerLike } from './player-like.types';
import { PlayerMovementFacade } from './player-movement-facade';
import { breakToy as breakToyImpl, setToy as setToyImpl } from './player-toys';

export abstract class PlayerToyFacade extends PlayerMovementFacade {
  protected abstract gameService: GameService;

  breakToy(respawn = false) {
    breakToyImpl(
      this as unknown as PlayerLike,
      respawn,
      this.logService,
      this.abilityService,
      this.gameService,
    );
  }

  setToy(toy: Toy) {
    setToyImpl(this as unknown as PlayerLike, toy);
  }
}

