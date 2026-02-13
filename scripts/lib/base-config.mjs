const MAX_MANA = 50;
const MAX_ADVANCED = 99;

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildInfiniteDamageMirrorBaseConfig() {
  const sharedPets = [
    {
      name: 'Giant Pangasius',
      attack: 50,
      health: 1,
      exp: 5,
      equipment: { name: 'Mushroom' },
      belugaSwallowedPet: null,
      mana: 50,
      triggersConsumed: 0,
      abominationSwallowedPet1: null,
      abominationSwallowedPet2: null,
      abominationSwallowedPet3: null,
      abominationSwallowedPet1TimesHurt: 0,
      abominationSwallowedPet2TimesHurt: 0,
      abominationSwallowedPet3TimesHurt: 0,
      timesHurt: 0,
      battlesFought: 0,
      equipmentUses: null,
    },
    {
      name: 'Abomination',
      attack: 100,
      health: 100,
      exp: 5,
      equipment: { name: 'Churros' },
      mana: 50,
      triggersConsumed: 0,
      abominationSwallowedPet1: 'Behemoth',
      abominationSwallowedPet1Level: 3,
      abominationSwallowedPet2: 'Leopard',
      abominationSwallowedPet2Level: 3,
      abominationSwallowedPet3: 'Beluga Whale',
      abominationSwallowedPet3Level: 1,
      abominationSwallowedPet3BelugaSwallowedPet: 'Giant Pangasius',
      abominationSwallowedPet1TimesHurt: 0,
      abominationSwallowedPet2TimesHurt: 0,
      abominationSwallowedPet3TimesHurt: 0,
      timesHurt: 0,
      battlesFought: 0,
      equipmentUses: null,
    },
    {
      name: 'Abomination',
      attack: 100,
      health: 100,
      exp: 5,
      equipment: { name: 'Cashew Nut' },
      mana: 50,
      triggersConsumed: 0,
      abominationSwallowedPet1: 'Behemoth',
      abominationSwallowedPet1Level: 3,
      abominationSwallowedPet2: 'Leopard',
      abominationSwallowedPet2Level: 3,
      abominationSwallowedPet3: 'Beluga Whale',
      abominationSwallowedPet3Level: 1,
      abominationSwallowedPet3BelugaSwallowedPet: 'Nessie',
      abominationSwallowedPet1TimesHurt: 0,
      abominationSwallowedPet2TimesHurt: 0,
      abominationSwallowedPet3TimesHurt: 0,
      timesHurt: 0,
      battlesFought: 0,
      equipmentUses: null,
    },
    {
      name: 'Abomination',
      attack: 100,
      health: 100,
      exp: 5,
      equipment: { name: 'Churros' },
      mana: 50,
      triggersConsumed: 0,
      abominationSwallowedPet1: 'Behemoth',
      abominationSwallowedPet1Level: 3,
      abominationSwallowedPet2: 'Leopard',
      abominationSwallowedPet2Level: 3,
      abominationSwallowedPet3: 'Sabertooth Tiger',
      abominationSwallowedPet3Level: 3,
      abominationSwallowedPet1TimesHurt: 0,
      abominationSwallowedPet2TimesHurt: 0,
      abominationSwallowedPet3TimesHurt: 25,
      timesHurt: 0,
      battlesFought: 0,
      equipmentUses: null,
    },
    {
      name: 'Abomination',
      attack: 100,
      health: 100,
      exp: 5,
      equipment: { name: 'Churros' },
      mana: 50,
      triggersConsumed: 0,
      abominationSwallowedPet1: 'Behemoth',
      abominationSwallowedPet1Level: 3,
      abominationSwallowedPet2: 'Leopard',
      abominationSwallowedPet2Level: 3,
      abominationSwallowedPet3: 'Beluga Whale',
      abominationSwallowedPet3Level: 1,
      abominationSwallowedPet3BelugaSwallowedPet: 'Slug',
      abominationSwallowedPet1TimesHurt: 0,
      abominationSwallowedPet2TimesHurt: 0,
      abominationSwallowedPet3TimesHurt: 0,
      timesHurt: 0,
      battlesFought: 0,
      equipmentUses: null,
    },
  ];

  // Keep parity with app preset-loading defaults:
  // - Default pack is Turtle unless explicitly changed in UI.
  // - allPets and mana default to false.
  // - tokenPets defaults to true.
  return {
    playerPack: 'Turtle',
    opponentPack: 'Turtle',
    playerToy: 'Nutcracker',
    playerToyLevel: 1,
    playerHardToy: null,
    playerHardToyLevel: 1,
    opponentToy: 'Nutcracker',
    opponentToyLevel: 1,
    opponentHardToy: null,
    opponentHardToyLevel: 1,
    turn: 11,
    playerGoldSpent: 10,
    opponentGoldSpent: 10,
    playerRollAmount: 47,
    opponentRollAmount: 47,
    playerSummonedAmount: 0,
    opponentSummonedAmount: 0,
    playerLevel3Sold: 0,
    opponentLevel3Sold: 0,
    playerTransformationAmount: 200,
    opponentTransformationAmount: 200,
    playerPets: deepClone(sharedPets),
    opponentPets: deepClone(sharedPets),
    customPacks: [],
    allPets: false,
    oldStork: false,
    tokenPets: true,
    komodoShuffle: false,
    mana: false,
    seed: null,
    simulationCount: 1,
    logsEnabled: false,
    maxLoggedBattles: 0,
    captureRandomDecisions: false,
    randomDecisionOverrides: [],
  };
}

function setPetListMaxMana(pets) {
  if (!Array.isArray(pets)) {
    return;
  }
  for (const pet of pets) {
    if (!pet || typeof pet !== 'object' || typeof pet.name !== 'string') {
      continue;
    }
    pet.mana = MAX_MANA;
  }
}

function applyMaxedBoardSettings(config) {
  config.turn = MAX_ADVANCED;
  config.playerGoldSpent = MAX_ADVANCED;
  config.opponentGoldSpent = MAX_ADVANCED;
  config.playerRollAmount = MAX_ADVANCED;
  config.opponentRollAmount = MAX_ADVANCED;
  config.playerLevel3Sold = MAX_ADVANCED;
  config.opponentLevel3Sold = MAX_ADVANCED;
  config.playerSummonedAmount = MAX_ADVANCED;
  config.opponentSummonedAmount = MAX_ADVANCED;
  config.playerTransformationAmount = MAX_ADVANCED;
  config.opponentTransformationAmount = MAX_ADVANCED;
  config.mana = true;
  setPetListMaxMana(config.playerPets);
  setPetListMaxMana(config.opponentPets);
}

function summarizeBaseConfig(config) {
  return {
    playerPack: config.playerPack ?? null,
    opponentPack: config.opponentPack ?? null,
    playerToy: config.playerToy ?? null,
    opponentToy: config.opponentToy ?? null,
    turn: config.turn ?? null,
    playerGoldSpent: config.playerGoldSpent ?? null,
    opponentGoldSpent: config.opponentGoldSpent ?? null,
    playerRollAmount: config.playerRollAmount ?? null,
    opponentRollAmount: config.opponentRollAmount ?? null,
    playerTransformationAmount: config.playerTransformationAmount ?? null,
    opponentTransformationAmount: config.opponentTransformationAmount ?? null,
    allPets: Boolean(config.allPets),
    tokenPets: Boolean(config.tokenPets),
    mana: Boolean(config.mana),
    oldStork: Boolean(config.oldStork),
    komodoShuffle: Boolean(config.komodoShuffle),
  };
}

export {
  MAX_MANA,
  MAX_ADVANCED,
  buildInfiniteDamageMirrorBaseConfig,
  applyMaxedBoardSettings,
  summarizeBaseConfig,
};
