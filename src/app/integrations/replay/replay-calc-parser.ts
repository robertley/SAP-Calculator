import {
  CustomPackConfig,
  PetConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import {
  KEY_MAP,
  PACK_MAP,
  PERKS_BY_ID,
  PETS_BY_ID,
  PETS_META_BY_ID,
  TOYS_BY_ID,
} from './replay-calc-schema';

interface ReplayAbilityJson {
  TrCo?: number | null;
}

interface ReplayPetStatsJson {
  Temp?: number | null;
  Perm?: number | null;
}

interface ReplayPetJson {
  Enu?: number | string | null;
  At?: ReplayPetStatsJson | null;
  Hp?: ReplayPetStatsJson | null;
  Exp?: number | null;
  Perk?: number | string | null;
  Mana?: number | null;
  Pow?: {
    SabertoothTigerAbility?: number | null;
  } | null;
  Abil?: ReplayAbilityJson[] | null;
  Poi?: {
    x?: number | null;
  } | null;
  MiMs?: {
    Lsts?: {
      WhiteWhaleAbility?: ReplayPetJson[] | null;
    } | null;
  } | null;
}

interface ReplayToyJson {
  Enu?: number | string | null;
  Lvl?: number | null;
}

export interface ReplayDeckJson {
  Id?: number | string | null;
  Title?: string | null;
  Minions?: Array<number | string> | null;
  Spells?: Array<string | number> | null;
}

export interface ReplayBoardJson {
  [key: string]: unknown;
  Mins?: {
    Items?: Array<ReplayPetJson | null> | null;
  } | null;
  Rel?: {
    Items?: Array<ReplayToyJson | null> | null;
  } | null;
  Deck?: ReplayDeckJson | null;
  Pack?: number | null;
}

export interface ReplayBattleJson {
  UserBoard?: ReplayBoardJson | null;
  OpponentBoard?: ReplayBoardJson | null;
}

export interface ReplayBuildModelJson {
  Bor?: {
    Deck?: ReplayDeckJson | null;
  } | null;
}

export interface ReplayMetaBoards {
  userBoard?: ReplayBoardJson | null;
  opponentBoard?: ReplayBoardJson | null;
}

export interface ReplayCustomPack extends CustomPackConfig {
  name: string;
  deckId?: string | null;
  tier1Pets: (string | null)[];
  tier2Pets: (string | null)[];
  tier3Pets: (string | null)[];
  tier4Pets: (string | null)[];
  tier5Pets: (string | null)[];
  tier6Pets: (string | null)[];
  spells: string[];
}

interface ReplayParsedToy {
  name: string | null;
  level: number;
}

type StrippedReplayPet = Pick<PetConfig, 'name'> & Partial<Omit<PetConfig, 'name'>>;

export interface ReplayCalculatorState {
  playerPack: string;
  opponentPack: string;
  playerToy: string | null;
  playerToyLevel: string;
  playerHardToy: null;
  playerHardToyLevel: number;
  opponentToy: string | null;
  opponentToyLevel: string;
  opponentHardToy: null;
  opponentHardToyLevel: number;
  turn: number;
  playerGoldSpent: number;
  opponentGoldSpent: number;
  playerRollAmount: number;
  opponentRollAmount: number;
  playerSummonedAmount: number;
  opponentSummonedAmount: number;
  playerLevel3Sold: number;
  opponentLevel3Sold: number;
  playerTransformationAmount: number;
  opponentTransformationAmount: number;
  playerPets: (PetConfig | null)[];
  opponentPets: (PetConfig | null)[];
  allPets: boolean;
  logFilter: string | null;
  customPacks: ReplayCustomPack[];
  oldStork: boolean;
  tokenPets: boolean;
  komodoShuffle: boolean;
  mana: boolean;
  seed: number | null;
  triggersConsumed: boolean;
  foodsEaten?: boolean;
  showAdvanced: boolean;
  showTriggerNamesInLogs: boolean;
  showSwallowedLevels: boolean;
  ailmentEquipment: boolean;
}

type ReplayCustomPackCore = Omit<ReplayCustomPack, 'deckId'>;

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toNumberOrFallback(value: unknown, fallback: number): number {
  const parsed = toFiniteNumber(value);
  return parsed ?? fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export class ReplayCalcParser {
  parseReplayForCalculator(
    battleJson: ReplayBattleJson,
    buildModel?: ReplayBuildModelJson,
    metaBoards?: ReplayMetaBoards,
  ): ReplayCalculatorState {
    const userBoard = battleJson?.UserBoard ?? metaBoards?.userBoard;
    const opponentBoard = battleJson?.OpponentBoard ?? metaBoards?.opponentBoard;

    const readBoardNumber = (
      board: ReplayBoardJson | null | undefined,
      key: string,
      fallback: number,
    ): number => {
      return toNumberOrFallback(board?.[key], fallback);
    };

    const getTimesHurt = (petJson: ReplayPetJson): number | null => {
      return toFiniteNumber(petJson?.Pow?.SabertoothTigerAbility);
    };

    const parsePet = (petJson: ReplayPetJson | null | undefined): PetConfig | null => {
      if (!petJson) {
        return null;
      }

      const petId = String(petJson.Enu ?? 0);
      const petTempAtk = toNumberOrFallback(petJson.At?.Temp, 0);
      const petTempHp = toNumberOrFallback(petJson.Hp?.Temp, 0);

      let belugaSwallowedPet: string | null = null;
      if (petId === '182') {
        const swallowedPets = petJson?.MiMs?.Lsts?.WhiteWhaleAbility ?? [];
        if (swallowedPets.length > 0) {
          const swallowedPetId = swallowedPets[0]?.Enu;
          belugaSwallowedPet =
            PETS_BY_ID.get(String(swallowedPetId)) || `Pet #${swallowedPetId}`;
        }
      }

      const timesHurt = getTimesHurt(petJson);
      const abilityTriggersConsumed = (petJson?.Abil ?? [])
        .map((ability) => toFiniteNumber(ability?.TrCo))
        .filter((value): value is number => value !== null);

      const parsedPet: PetConfig = {
        name: PETS_BY_ID.get(petId) || null,
        attack: toNumberOrFallback(petJson.At?.Perm, 0) + petTempAtk,
        health: toNumberOrFallback(petJson.Hp?.Perm, 0) + petTempHp,
        exp: toNumberOrFallback(petJson.Exp, 0),
        equipment: petJson.Perk
          ? { name: PERKS_BY_ID.get(String(petJson.Perk)) || 'Unknown Perk' }
          : null,
        mana: toNumberOrFallback(petJson.Mana, 0),
        belugaSwallowedPet,
        sarcasticFringeheadSwallowedPet: null,
        abominationSwallowedPet1: null,
        abominationSwallowedPet2: null,
        abominationSwallowedPet3: null,
        abominationSwallowedPet1Level: 1,
        abominationSwallowedPet2Level: 1,
        abominationSwallowedPet3Level: 1,
        battlesFought: 0,
        triggersConsumed:
          abilityTriggersConsumed.length > 0
            ? Math.max(...abilityTriggersConsumed)
            : 0,
      };

      if (timesHurt !== null) {
        parsedPet.timesHurt = timesHurt;
      }

      return parsedPet;
    };

    const parseBoardPets = (
      boardJson: ReplayBoardJson | null | undefined,
    ): (PetConfig | null)[] => {
      const pets = (boardJson?.Mins?.Items ?? []).filter(
        (pet): pet is ReplayPetJson => pet !== null,
      );
      const petArray: (PetConfig | null)[] = Array(5).fill(null);

      pets.forEach((pet, index) => {
        let pos = toFiniteNumber(pet.Poi?.x);
        if (pos === null) {
          pos = index;
        }
        if (pos >= 0 && pos < 5) {
          petArray[pos] = parsePet(pet);
        }
      });

      return petArray.reverse();
    };

    const getToy = (boardJson: ReplayBoardJson | null | undefined): ReplayParsedToy => {
      const toyItem = (boardJson?.Rel?.Items ?? []).find((item) => Boolean(item?.Enu));
      if (toyItem) {
        const toyId = String(toyItem.Enu);
        return {
          name: TOYS_BY_ID.get(toyId) || null,
          level: toNumberOrFallback(toyItem.Lvl, 1),
        };
      }
      return { name: null, level: 1 };
    };

    const playerToy = getToy(userBoard);
    const opponentToy = getToy(opponentBoard);

    const customPacks = this.buildCustomPacksFromGenesis(buildModel, battleJson);
    const playerCustomPack = this.findCustomPackFromDeck(
      customPacks,
      userBoard?.Deck,
    );
    const opponentCustomPack = this.findCustomPackFromDeck(
      customPacks,
      opponentBoard?.Deck,
    );
    const playerPackName =
      PACK_MAP[toNumberOrFallback(userBoard?.Pack, NaN)] ||
      playerCustomPack?.name ||
      'Turtle';
    const opponentPackName =
      PACK_MAP[toNumberOrFallback(opponentBoard?.Pack, NaN)] ||
      opponentCustomPack?.name ||
      'Turtle';

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
      turn: readBoardNumber(userBoard, 'Tur', 1) || 1,
      playerGoldSpent: readBoardNumber(userBoard, 'GoSp', 0) || 0,
      opponentGoldSpent: readBoardNumber(opponentBoard, 'GoSp', 0) || 0,
      playerRollAmount: readBoardNumber(userBoard, 'Rold', 0) || 0,
      opponentRollAmount: readBoardNumber(opponentBoard, 'Rold', 0) || 0,
      playerSummonedAmount: readBoardNumber(userBoard, 'MiSu', 0) || 0,
      opponentSummonedAmount: readBoardNumber(opponentBoard, 'MiSu', 0) || 0,
      playerLevel3Sold: readBoardNumber(userBoard, 'MSFL', 0) || 0,
      opponentLevel3Sold: readBoardNumber(opponentBoard, 'MSFL', 0) || 0,
      playerTransformationAmount: readBoardNumber(userBoard, 'TrTT', 0) || 0,
      opponentTransformationAmount: readBoardNumber(opponentBoard, 'TrTT', 0) || 0,
      playerPets: parseBoardPets(userBoard),
      opponentPets: parseBoardPets(opponentBoard),
      allPets: false,
      logFilter: null,
      customPacks,
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: true,
      seed: null,
      triggersConsumed: true,
      showAdvanced: true,
      showTriggerNamesInLogs: false,
      showSwallowedLevels: false,
      ailmentEquipment: false,
    };
  }

  buildCustomPacksFromGenesis(
    buildModel?: ReplayBuildModelJson,
    battleJson?: ReplayBattleJson,
  ): ReplayCustomPack[] {
    const decks = [
      buildModel?.Bor?.Deck,
      battleJson?.UserBoard?.Deck,
      battleJson?.OpponentBoard?.Deck,
    ].filter(
      (deck): deck is ReplayDeckJson =>
        deck !== null && deck !== undefined && Array.isArray(deck.Minions),
    );

    const packs: ReplayCustomPack[] = [];
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

  generateCalculatorLink(calculatorState: ReplayCalculatorState): string {
    const baseUrl = window.location.origin + window.location.pathname;
    const strippedState = this.stripDefaultValues(calculatorState);
    const truncatedState = this.truncateKeys(strippedState);
    const stateString = JSON.stringify(truncatedState);
    const base64Data = btoa(stateString);
    return `${baseUrl}#c=${base64Data}`;
  }

  private buildCustomPackFromDeck(
    deck: ReplayDeckJson | null | undefined,
    usedNames: Set<string>,
  ): ReplayCustomPackCore | null {
    if (!deck || !Array.isArray(deck.Minions)) {
      return null;
    }

    const minions = deck.Minions.map((id) => String(id));
    const spells = Array.isArray(deck.Spells) ? deck.Spells.map(String) : [];
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

    const normalizeTierPets = (pets: string[]): (string | null)[] => {
      const normalized = pets.slice(0, 10);
      while (normalized.length < 10) {
        normalized.push(null);
      }
      return normalized;
    };

    let deckName = deck.Title || 'Custom Pack';
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
      spells,
    };
  }

  private findCustomPackFromDeck(
    customPacks: ReplayCustomPack[],
    deck: ReplayDeckJson | null | undefined,
  ): ReplayCustomPack | null {
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

  private stripDefaultValues(
    state: ReplayCalculatorState,
  ): Record<string, unknown> {
    const strippedState: Record<string, unknown> = {};

    if (state.playerPack !== 'Turtle') {
      strippedState.playerPack = state.playerPack;
    }
    if (state.opponentPack !== 'Turtle') {
      strippedState.opponentPack = state.opponentPack;
    }
    if (state.playerToy) {
      strippedState.playerToy = state.playerToy;
    }
    if (state.playerToyLevel && state.playerToyLevel !== '1') {
      strippedState.playerToyLevel = state.playerToyLevel;
    }
    if (state.opponentToy) {
      strippedState.opponentToy = state.opponentToy;
    }
    if (state.opponentToyLevel && state.opponentToyLevel !== '1') {
      strippedState.opponentToyLevel = state.opponentToyLevel;
    }
    if (state.turn !== 11) {
      strippedState.turn = state.turn;
    }
    if (state.playerGoldSpent !== 10) {
      strippedState.playerGoldSpent = state.playerGoldSpent;
    }
    if (state.opponentGoldSpent !== 10) {
      strippedState.opponentGoldSpent = state.opponentGoldSpent;
    }
    if (state.playerRollAmount !== 4) {
      strippedState.playerRollAmount = state.playerRollAmount;
    }
    if (state.opponentRollAmount !== 4) {
      strippedState.opponentRollAmount = state.opponentRollAmount;
    }
    if (state.playerSummonedAmount !== 0) {
      strippedState.playerSummonedAmount = state.playerSummonedAmount;
    }
    if (state.opponentSummonedAmount !== 0) {
      strippedState.opponentSummonedAmount = state.opponentSummonedAmount;
    }
    if (state.playerLevel3Sold !== 0) {
      strippedState.playerLevel3Sold = state.playerLevel3Sold;
    }
    if (state.opponentLevel3Sold !== 0) {
      strippedState.opponentLevel3Sold = state.opponentLevel3Sold;
    }
    if (state.playerTransformationAmount !== 0) {
      strippedState.playerTransformationAmount = state.playerTransformationAmount;
    }
    if (state.opponentTransformationAmount !== 0) {
      strippedState.opponentTransformationAmount = state.opponentTransformationAmount;
    }

    if (state.allPets) {
      strippedState.allPets = true;
    }
    if (state.oldStork) {
      strippedState.oldStork = true;
    }
    if (state.tokenPets) {
      strippedState.tokenPets = true;
    }
    if (state.komodoShuffle) {
      strippedState.komodoShuffle = true;
    }
    if (state.mana) {
      strippedState.mana = true;
    }
    if (state.seed != null) {
      strippedState.seed = state.seed;
    }
    if (state.triggersConsumed) {
      strippedState.triggersConsumed = true;
    }
    if (state.foodsEaten) {
      strippedState.foodsEaten = true;
    }
    if (state.showAdvanced) {
      strippedState.showAdvanced = true;
    }
    if (state.showTriggerNamesInLogs) {
      strippedState.showTriggerNamesInLogs = true;
    }
    if (state.showSwallowedLevels) {
      strippedState.showSwallowedLevels = true;
    }
    if (state.ailmentEquipment) {
      strippedState.ailmentEquipment = true;
    }

    if (state.logFilter) {
      strippedState.logFilter = state.logFilter;
    }
    if (state.customPacks.length > 0) {
      strippedState.customPacks = state.customPacks;
    }

    const stripPetDefaults = (pet: PetConfig | null): StrippedReplayPet | null => {
      if (!pet || !pet.name) {
        return null;
      }

      const newPet: StrippedReplayPet = { name: pet.name };

      if (typeof pet.attack === 'number' && pet.attack !== 0) {
        newPet.attack = pet.attack;
      }
      if (typeof pet.health === 'number' && pet.health !== 0) {
        newPet.health = pet.health;
      }
      if (typeof pet.exp === 'number' && pet.exp !== 0) {
        newPet.exp = pet.exp;
      }
      if (typeof pet.mana === 'number' && pet.mana !== 0) {
        newPet.mana = pet.mana;
      }
      if (pet.equipment) {
        newPet.equipment = pet.equipment;
      }
      if (pet.triggersConsumed) {
        newPet.triggersConsumed = pet.triggersConsumed;
      }
      if (pet.foodsEaten) {
        newPet.foodsEaten = pet.foodsEaten;
      }
      if (pet.belugaSwallowedPet != null) {
        newPet.belugaSwallowedPet = pet.belugaSwallowedPet;
      }
      if (pet.timesHurt) {
        newPet.timesHurt = pet.timesHurt;
      }

      return newPet;
    };

    const strippedPlayerPets = state.playerPets.map(stripPetDefaults);
    if (strippedPlayerPets.some((pet) => pet !== null)) {
      strippedState.playerPets = strippedPlayerPets;
    }

    const strippedOpponentPets = state.opponentPets.map(stripPetDefaults);
    if (strippedOpponentPets.some((pet) => pet !== null)) {
      strippedState.opponentPets = strippedOpponentPets;
    }

    return strippedState;
  }

  private truncateKeys(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.truncateKeys(item));
    }
    if (isRecord(data)) {
      const newObj: Record<string, unknown> = {};
      for (const key of Object.keys(data)) {
        const newKey = KEY_MAP[key] || key;
        newObj[newKey] = this.truncateKeys(data[key]);
      }
      return newObj;
    }
    return data;
  }
}
