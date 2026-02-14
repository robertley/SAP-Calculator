import { AbilityEvent } from 'app/domain/interfaces/ability-event.interface';
import { Puma } from 'app/domain/entities/catalog/pets/puppy/tier-6/puma.class';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { Toy } from '../toy.class';
import type { Player } from '../player.class';
import type { PlayerLike } from './player-like.types';


export const breakToy = (
  player: PlayerLike,
  respawn: boolean,
  logService: LogService,
  abilityService: AbilityService,
  gameService: GameService,
): void => {
  const breakSingleToy = (toy: Toy): void => {
    logService.createLog({
      message: `${toy.name} broke!`,
      type: 'ability',
      player: player as Player,
      randomEvent: false,
    });
    if (toy.onBreak == null) {
      return;
    }

    const events: AbilityEvent[] = [
      {
        callback: toy.onBreak.bind(toy),
        priority: 99,
      },
    ];
    const toyLevel = toy.level;
    for (const pet of player.petArray) {
      if (pet instanceof Puma) {
        const callback = () => {
          toy.level = pet.level;
          toy.onBreak(gameService.gameApi, true);
          toy.level = toyLevel;
        };
        events.push({
          callback: callback,
          priority: pet.attack,
        });
      }
    }
    events.sort((a, b) => {
      return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0;
    });
    for (const event of events) {
      event.callback(gameService.gameApi);
    }
  };

  if (player.toy != null) {
    const toy = player.toy;
    player.brokenToy = toy;
    breakSingleToy(toy);
    player.toy = null;
  }

  if (player.hardToy != null) {
    const toy = player.hardToy;
    player.brokenHardToy = toy;
    breakSingleToy(toy);
    player.hardToy = null;
  }

  if (respawn) {
    if (player.brokenToy) {
      setToy(player, player.brokenToy);
    }
  }
};

export const setToy = (player: PlayerLike, toy: Toy): void => {
  player.toy = toy;
};





