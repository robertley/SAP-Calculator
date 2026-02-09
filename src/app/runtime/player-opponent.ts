import { Player } from 'app/domain/entities/player.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';

export function getOpponent(gameApi: GameAPI, player: Player): Player {
  if (gameApi.player === player) {
    return gameApi.opponent;
  }
  return gameApi.player;
}

