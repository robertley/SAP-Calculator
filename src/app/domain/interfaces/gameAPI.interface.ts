import { Player } from 'app/domain/entities/player.class';

export interface GameAPI {
  player: Player;
  opponent: Player;
  playerPetPool?: Map<number, string[]>;
  opponentPetPool?: Map<number, string[]>;
  previousShopTier?: number;
  turnNumber?: number;
  playerGoldSpent?: number;
  opponentGoldSpent?: number;
  playerHardToy?: string | null;
  playerHardToyLevel?: number;
  opponentHardToy?: string | null;
  opponentHardToyLevel?: number;
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
  playerTransformationAmount?: number;
  opponentTransformationAmount?: number;
  FirstNonJumpAttackHappened?: boolean;
}

