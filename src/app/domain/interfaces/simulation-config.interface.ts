import { PetMemoryState } from './pet-memory.interface';
import { Battle } from './battle.interface';

export interface PetConfig extends PetMemoryState {
  name: string | null;
  attack?: number;
  health?: number;
  exp?: number;
  equipment?: { name: string } | null;
  equipmentUses?: number | null;
  mana?: number;
  triggersConsumed?: number;
  foodsEaten?: number;
  battlesFought?: number;
  timesHurt?: number;
  friendsDiedBeforeBattle?: number;
}

export interface CustomPackConfig {
  name: string;
  tier1Pets?: Array<string | null>;
  tier2Pets?: Array<string | null>;
  tier3Pets?: Array<string | null>;
  tier4Pets?: Array<string | null>;
  tier5Pets?: Array<string | null>;
  tier6Pets?: Array<string | null>;
  spells?: string[];
}

export interface SimulationConfig {
  playerPack: string;
  opponentPack: string;
  playerToy?: string | null;
  playerToyLevel?: number;
  playerHardToy?: string | null;
  playerHardToyLevel?: number;
  opponentToy?: string | null;
  opponentToyLevel?: number;
  opponentHardToy?: string | null;
  opponentHardToyLevel?: number;
  turn: number;
  playerGoldSpent?: number;
  opponentGoldSpent?: number;
  playerRollAmount?: number;
  opponentRollAmount?: number;
  playerSummonedAmount?: number;
  opponentSummonedAmount?: number;
  playerLevel3Sold?: number;
  opponentLevel3Sold?: number;
  playerTransformationAmount?: number;
  opponentTransformationAmount?: number;
  playerLostLastBattle?: boolean;
  opponentLostLastBattle?: boolean;
  playerPets: (PetConfig | null)[];
  opponentPets: (PetConfig | null)[];
  customPacks?: CustomPackConfig[];
  allPets?: boolean;
  oldStork?: boolean;
  tokenPets?: boolean;
  komodoShuffle?: boolean;
  mana?: boolean;
  seed?: number | null;
  optimizeDeterministicSimulations?: boolean;
  simulationCount?: number;
  logsEnabled?: boolean;
  maxLoggedBattles?: number;
  captureRandomDecisions?: boolean;
  randomDecisionOverrides?: RandomDecisionOverride[];
  strictRandomOverrideValidation?: boolean;
}

export interface SimulationResult {
  playerWins: number;
  opponentWins: number;
  draws: number;
  battles?: Battle[];
  randomDecisions?: RandomDecisionCapture[];
  randomOverrideError?: string | null;
}

export interface RandomDecisionOption {
  id: string;
  label: string;
}

export interface RandomDecisionCapture {
  index: number;
  key: string;
  label: string;
  options: RandomDecisionOption[];
  selectedOptionId: string | null;
  forced: boolean;
}

export interface RandomDecisionOverride {
  index: number;
  optionId: string;
  key?: string;
  label?: string;
}
