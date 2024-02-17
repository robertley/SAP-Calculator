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
    mana?: boolean;
    day?: boolean;
    playerRollAmount?: number;
    opponentRollAmount?: number;
    playerLevel3Sold?: number;
    opponentLevel3Sold?: number;
    playerSummonedAmount?: number;
    opponentSummonedAmount?: number;

}