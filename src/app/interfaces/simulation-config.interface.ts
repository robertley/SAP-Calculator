
export interface PetConfig {
    name: string | null;
    attack?: number;
    health?: number;
    exp?: number;
    equipment?: { name: string } | null;
    belugaSwallowedPet?: string | null;
    mana?: number;
    triggersConsumed?: number;
    abominationSwallowedPet1?: string | null;
    abominationSwallowedPet2?: string | null;
    abominationSwallowedPet3?: string | null;
    battlesFought?: number;
    timesHurt?: number;
}

export interface SimulationConfig {
    playerPack: string;
    opponentPack: string;
    playerToy?: string | null;
    playerToyLevel?: number;
    opponentToy?: string | null;
    opponentToyLevel?: number;
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
    angler?: boolean;
    allPets?: boolean;
    oldStork?: boolean;
    tokenPets?: boolean;
    komodoShuffle?: boolean;
    mana?: boolean;
    simulationCount?: number;
}

export interface SimulationResult {
    playerWins: number;
    opponentWins: number;
    draws: number;
    battles?: any[]; // Using any[] for now to avoid importing Battle interface cycle
}
