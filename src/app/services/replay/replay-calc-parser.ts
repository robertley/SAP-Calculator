import {
  KEY_MAP,
  PACK_MAP,
  PERKS_BY_ID,
  PETS_BY_ID,
  PETS_META_BY_ID,
  TOYS_BY_ID
} from "./replay-calc-schema";

export class ReplayCalcParser {
  parseReplayForCalculator(
    battleJson: any,
    buildModel?: any,
    metaBoards?: { userBoard?: any; opponentBoard?: any },
  ) {
    const userBoard = battleJson?.UserBoard ?? metaBoards?.userBoard;
    const opponentBoard = battleJson?.OpponentBoard ?? metaBoards?.opponentBoard;

    const readBoardValue = (board: any, key: string, fallback: any = null) => {
      const value = board?.[key];
      return value === undefined ? fallback : value;
    };

    const getTimesHurt = (petJson: any) => {
      const value = petJson?.Pow?.SabertoothTigerAbility;
      return Number.isFinite(value) ? value : null;
    };

    const parsePet = (petJson: any) => {
      if (!petJson) {
        return null;
      }

      const petId = String(petJson.Enu ?? 0);
      const petTempAtk = petJson.At?.Temp ?? 0;
      const petTempHp = petJson.Hp?.Temp ?? 0;

      let belugaSwallowedPet = null;
      if (petId === "182") {
        const swallowedPets = petJson?.MiMs?.Lsts?.WhiteWhaleAbility || [];
        if (swallowedPets.length > 0) {
          const swallowedPetId = swallowedPets[0]?.Enu;
          belugaSwallowedPet =
            PETS_BY_ID.get(String(swallowedPetId)) || `Pet #${swallowedPetId}`;
        }
      }

      const timesHurt = getTimesHurt(petJson);
      const abilityTriggersConsumed = (petJson?.Abil || [])
        .map((ability: any) => ability?.TrCo)
        .filter((value: any) => Number.isFinite(value));

      const parsedPet: any = {
        name: PETS_BY_ID.get(petId) || null,
        attack: (petJson.At?.Perm ?? 0) + petTempAtk,
        health: (petJson.Hp?.Perm ?? 0) + petTempHp,
        exp: petJson.Exp || 0,
        equipment: petJson.Perk
          ? { name: PERKS_BY_ID.get(String(petJson.Perk)) || "Unknown Perk" }
          : null,
        mana: petJson.Mana || 0,
        belugaSwallowedPet: belugaSwallowedPet,
        sarcasticFringeheadSwallowedPet: null,
        abominationSwallowedPet1: null,
        abominationSwallowedPet2: null,
        abominationSwallowedPet3: null,
        abominationSwallowedPet1Level: 1,
        abominationSwallowedPet2Level: 1,
        abominationSwallowedPet3Level: 1,
        battlesFought: 0,
        triggersConsumed: abilityTriggersConsumed.length > 0 ? Math.max(...abilityTriggersConsumed) : 0,
      };

      if (timesHurt !== null) {
        parsedPet.timesHurt = timesHurt;
      }

      return parsedPet;
    };

    const parseBoardPets = (boardJson: any) => {
      const pets = (boardJson?.Mins?.Items || []).filter(Boolean);
      const petArray = Array(5).fill(null);

      pets.forEach((pet: any, index: number) => {
        let pos = pet.Poi?.x;
        if (pos === undefined) {
          pos = index;
        }
        if (pos >= 0 && pos < 5) {
          petArray[pos] = parsePet(pet);
        }
      });

      return petArray.reverse();
    };

    const getToy = (boardJson: any) => {
      const toyItem = (boardJson?.Rel?.Items || []).find(
        (item: any) => item && item.Enu,
      );
      if (toyItem) {
        const toyId = String(toyItem.Enu);
        return {
          name: TOYS_BY_ID.get(toyId) || null,
          level: toyItem.Lvl || 1,
        };
      }
      return { name: null, level: 1 };
    };

    const playerToy = getToy(userBoard);
    const opponentToy = getToy(opponentBoard);

    const customPacks = this.buildCustomPacksFromGenesis(
      buildModel,
      battleJson,
    );
    const playerCustomPack = this.findCustomPackFromDeck(
      customPacks,
      userBoard?.Deck,
    );
    const opponentCustomPack = this.findCustomPackFromDeck(
      customPacks,
      opponentBoard?.Deck,
    );
    const playerPackName =
      PACK_MAP[userBoard?.Pack] || playerCustomPack?.name || "Turtle";
    const opponentPackName =
      PACK_MAP[opponentBoard?.Pack] || opponentCustomPack?.name || "Turtle";

    return {
      playerPack: playerPackName,
      opponentPack: opponentPackName,
      playerToy: playerToy.name,
      playerToyLevel: String(playerToy.level),
      playerHardToy: null,
      playerHardToyLevel: 1,
      opponentToy: opponentToy.name,
      opponentToyLevel: String(opponentToy.level),
      opponentHardToy: null,
      opponentHardToyLevel: 1,
      turn: readBoardValue(userBoard, "Tur", 1) || 1,
      playerGoldSpent: readBoardValue(userBoard, "GoSp", 0) || 0,
      opponentGoldSpent: readBoardValue(opponentBoard, "GoSp", 0) || 0,
      playerRollAmount: readBoardValue(userBoard, "Rold", 0) || 0,
      opponentRollAmount: readBoardValue(opponentBoard, "Rold", 0) || 0,
      playerSummonedAmount: readBoardValue(userBoard, "MiSu", 0) || 0,
      opponentSummonedAmount: readBoardValue(opponentBoard, "MiSu", 0) || 0,
      playerLevel3Sold: readBoardValue(userBoard, "MSFL", 0) || 0,
      opponentLevel3Sold: readBoardValue(opponentBoard, "MSFL", 0) || 0,
      playerTransformationAmount: readBoardValue(userBoard, "TrTT", 0) || 0,
      opponentTransformationAmount: readBoardValue(opponentBoard, "TrTT", 0) || 0,
      playerPets: parseBoardPets(userBoard),
      opponentPets: parseBoardPets(opponentBoard),
      allPets: false,
      logFilter: null,
      customPacks: customPacks,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: true,
      triggersConsumed: true,
      showAdvanced: true,
      showSwallowedLevels: false,
      ailmentEquipment: false,
    };
  }

  buildCustomPacksFromGenesis(buildModel?: any, battleJson?: any) {
    const decks = [
      buildModel?.Bor?.Deck,
      battleJson?.UserBoard?.Deck,
      battleJson?.OpponentBoard?.Deck,
    ].filter((deck) => deck && Array.isArray(deck.Minions));

    const packs: Array<{
      name: string;
      deckId: string | null;
      tier1Pets: (string | null)[];
      tier2Pets: (string | null)[];
      tier3Pets: (string | null)[];
      tier4Pets: (string | null)[];
      tier5Pets: (string | null)[];
      tier6Pets: (string | null)[];
    }> = [];

    const seenDeckIds = new Set<string>();
    const usedNames = new Set<string>();

    for (const deck of decks) {
      const deckId = deck?.Id ? String(deck.Id) : null;
      if (deckId && seenDeckIds.has(deckId)) {
        continue;
      }
      if (deckId) {
        seenDeckIds.add(deckId);
      }
      const pack = this.buildCustomPackFromDeck(deck, usedNames);
      if (pack) {
        packs.push({ ...pack, deckId });
      }
    }

    return packs;
  }

  generateCalculatorLink(calculatorState: any) {
    const baseUrl = window.location.origin + window.location.pathname;
    const strippedState = this.stripDefaultValues(calculatorState);
    const truncatedState = this.truncateKeys(strippedState);
    const stateString = JSON.stringify(truncatedState);
    const base64Data = btoa(stateString);
    return `${baseUrl}?c=${base64Data}`;
  }

  private buildCustomPackFromDeck(deck: any, usedNames: Set<string>) {
    if (!deck || !Array.isArray(deck.Minions)) {
      return null;
    }

    const minions = deck.Minions.map((id: number) => String(id));
    const spells = Array.isArray(deck.Spells) ? deck.Spells.slice() : [];
    const tierPets: Record<number, string[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    for (const minionId of minions) {
      const petMeta = PETS_META_BY_ID.get(minionId);
      if (!petMeta) {
        continue;
      }
      if (tierPets[petMeta.tier]) {
        tierPets[petMeta.tier].push(petMeta.name);
      }
    }

    const normalizeTierPets = (pets: string[]) => {
      const normalized = pets.slice(0, 10);
      while (normalized.length < 10) {
        normalized.push(null);
      }
      return normalized as (string | null)[];
    };

    let deckName = deck.Title || "Custom Pack";
    if (usedNames.has(deckName)) {
      let suffix = 2;
      while (usedNames.has(`${deckName} (${suffix})`)) {
        suffix += 1;
      }
      deckName = `${deckName} (${suffix})`;
    }
    usedNames.add(deckName);

    return {
      name: deckName,
      tier1Pets: normalizeTierPets(tierPets[1]),
      tier2Pets: normalizeTierPets(tierPets[2]),
      tier3Pets: normalizeTierPets(tierPets[3]),
      tier4Pets: normalizeTierPets(tierPets[4]),
      tier5Pets: normalizeTierPets(tierPets[5]),
      tier6Pets: normalizeTierPets(tierPets[6]),
      spells: spells,
    };
  }

  private findCustomPackFromDeck(
    customPacks: Array<{ name: string; deckId?: string | null }>,
    deck: any,
  ) {
    if (!deck) {
      return null;
    }
    const deckId = deck?.Id ? String(deck.Id) : null;
    if (deckId) {
      const byId = customPacks.find((pack) => pack.deckId === deckId);
      if (byId) {
        return byId;
      }
    }
    const deckName = deck?.Title;
    if (deckName) {
      return customPacks.find((pack) => pack.name === deckName) || null;
    }
    return null;
  }

  private stripDefaultValues(state: any) {
    const strippedState: any = {};

    if (state.playerPack !== "Turtle")
      strippedState.playerPack = state.playerPack;
    if (state.opponentPack !== "Turtle")
      strippedState.opponentPack = state.opponentPack;
    if (state.playerToy) strippedState.playerToy = state.playerToy;
    if (state.playerToyLevel && state.playerToyLevel !== "1")
      strippedState.playerToyLevel = state.playerToyLevel;
    if (state.opponentToy) strippedState.opponentToy = state.opponentToy;
    if (state.opponentToyLevel && state.opponentToyLevel !== "1")
      strippedState.opponentToyLevel = state.opponentToyLevel;
    if (state.turn !== 11) strippedState.turn = state.turn;
    if (state.playerGoldSpent !== 10)
      strippedState.playerGoldSpent = state.playerGoldSpent;
    if (state.opponentGoldSpent !== 10)
      strippedState.opponentGoldSpent = state.opponentGoldSpent;
    if (state.playerRollAmount !== 4)
      strippedState.playerRollAmount = state.playerRollAmount;
    if (state.opponentRollAmount !== 4)
      strippedState.opponentRollAmount = state.opponentRollAmount;
    if (state.playerSummonedAmount !== 0)
      strippedState.playerSummonedAmount = state.playerSummonedAmount;
    if (state.opponentSummonedAmount !== 0)
      strippedState.opponentSummonedAmount = state.opponentSummonedAmount;
    if (state.playerLevel3Sold !== 0)
      strippedState.playerLevel3Sold = state.playerLevel3Sold;
    if (state.opponentLevel3Sold !== 0)
      strippedState.opponentLevel3Sold = state.opponentLevel3Sold;
    if (state.playerTransformationAmount !== 0)
      strippedState.playerTransformationAmount =
        state.playerTransformationAmount;
    if (state.opponentTransformationAmount !== 0)
      strippedState.opponentTransformationAmount =
        state.opponentTransformationAmount;

    if (state.allPets) strippedState.allPets = true;
    if (state.oldStork) strippedState.oldStork = true;
    if (state.tokenPets) strippedState.tokenPets = true;
    if (state.komodoShuffle) strippedState.komodoShuffle = true;
    if (state.mana) strippedState.mana = true;
    if (state.triggersConsumed) strippedState.triggersConsumed = true;
    if (state.showAdvanced) strippedState.showAdvanced = true;
    if (state.showSwallowedLevels) strippedState.showSwallowedLevels = true;
    if (state.ailmentEquipment) strippedState.ailmentEquipment = true;

    if (state.logFilter) strippedState.logFilter = state.logFilter;
    if (state.customPacks && state.customPacks.length > 0)
      strippedState.customPacks = state.customPacks;

    const stripPetDefaults = (pet: any) => {
      if (!pet || !pet.name) {
        return null;
      }

      const newPet: any = { name: pet.name };

      if (pet.attack !== 0) newPet.attack = pet.attack;
      if (pet.health !== 0) newPet.health = pet.health;
      if (pet.exp !== 0) newPet.exp = pet.exp;
      if (pet.mana !== 0) newPet.mana = pet.mana;
      if (pet.equipment) newPet.equipment = pet.equipment;
      if (pet.triggersConsumed) newPet.triggersConsumed = pet.triggersConsumed;
      if (pet.belugaSwallowedPet !== null)
        newPet.belugaSwallowedPet = pet.belugaSwallowedPet;
      if (pet.timesHurt) newPet.timesHurt = pet.timesHurt;

      return newPet;
    };

    const strippedPlayerPets = state.playerPets.map(stripPetDefaults);
    if (strippedPlayerPets.some((pet: any) => pet !== null)) {
      strippedState.playerPets = strippedPlayerPets;
    }

    const strippedOpponentPets = state.opponentPets.map(stripPetDefaults);
    if (strippedOpponentPets.some((pet: any) => pet !== null)) {
      strippedState.opponentPets = strippedOpponentPets;
    }

    return strippedState;
  }

  private truncateKeys(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.truncateKeys(item));
    }
    if (data !== null && typeof data === "object") {
      const newObj: any = {};
      for (const key in data) {
        const newKey = KEY_MAP[key] || key;
        newObj[newKey] = this.truncateKeys(data[key]);
      }
      return newObj;
    }
    return data;
  }
}
