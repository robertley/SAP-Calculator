import { Injectable } from '@angular/core';
import { Player } from 'app/domain/entities/player.class';
import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameApi: GameAPI;

  constructor() {}

  init(player: Player, opponent: Player) {
    this.gameApi = {
      player: player,
      opponent: opponent,
    };
  }

  setTierGroupPets(
    playerPetPool?: Map<number, string[]>,
    opponentPetPool?: Map<number, string[]>,
  ) {
    if (playerPetPool != null) this.gameApi.playerPetPool = playerPetPool;

    if (opponentPetPool != null) this.gameApi.opponentPetPool = opponentPetPool;

    // console.log(this.gameApi)
  }

  setPreviousShopTier(tier: number) {
    this.gameApi.previousShopTier = tier;
  }

  setTurnNumber(turnNumber: number) {
    this.gameApi.turnNumber = turnNumber;
  }

  setGoldSpent(playerGoldSpent: number, opponentGoldSpent: number) {
    if (playerGoldSpent != null) {
      this.gameApi.playerGoldSpent = playerGoldSpent;
    }
    if (opponentGoldSpent != null) {
      this.gameApi.opponentGoldSpent = opponentGoldSpent;
    }
  }
}

