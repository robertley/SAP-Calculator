import { Pet } from "../classes/pet.class";
import { Player } from "../classes/player.class";

export interface GameAPI {
    player: Player;
    opponet: Player;
    playerPetPool?: Map<number, string[]>;
    opponentPetPool?: Map<number, string[]>;
    previousShopTier?: number;
    turnNumber?: number;
    playerGoldSpent?: number;
    opponentGoldSpent?: number;
    oldStork?: boolean;
    komodoShuffle?: boolean;
}