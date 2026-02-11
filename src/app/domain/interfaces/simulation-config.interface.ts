export interface PetConfig {
  name: string | null;
  attack?: number;
  health?: number;
  exp?: number;
  equipment?: { name: string } | null;
  equipmentUses?: number | null;
  belugaSwallowedPet?: string | null;
  mana?: number;
  triggersConsumed?: number;
  foodsEaten?: number;
  abominationSwallowedPet1?: string | null;
  abominationSwallowedPet2?: string | null;
  abominationSwallowedPet3?: string | null;
  abominationSwallowedPet1BelugaSwallowedPet?: string | null;
  abominationSwallowedPet2BelugaSwallowedPet?: string | null;
  abominationSwallowedPet3BelugaSwallowedPet?: string | null;
  abominationSwallowedPet1Level?: number | null;
  abominationSwallowedPet2Level?: number | null;
  abominationSwallowedPet3Level?: number | null;
  abominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPet?: string | null;
  abominationSwallowedPet2ParrotCopyPet?: string | null;
  abominationSwallowedPet3ParrotCopyPet?: string | null;
  abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2?: string | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3?: string | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level?:
    | number
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level?:
    | number
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level?:
    | number
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level?:
    | number
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level?:
    | number
    | null;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level?:
    | number
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level?:
    | number
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level?:
    | number
    | null;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level?:
    | number
    | null;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPet?: string | null;
  parrotCopyPetBelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1?: string | null;
  parrotCopyPetAbominationSwallowedPet2?: string | null;
  parrotCopyPetAbominationSwallowedPet3?: string | null;
  parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1Level?: number | null;
  parrotCopyPetAbominationSwallowedPet2Level?: number | null;
  parrotCopyPetAbominationSwallowedPet3Level?: number | null;
  parrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPet?: string | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?:
    | string
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level?:
    | number
    | null;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
  battlesFought?: number;
  timesHurt?: number;
  sarcasticFringeheadSwallowedPet?: string | null;
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
  battles?: any[]; // Using any[] for now to avoid importing Battle interface cycle
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
