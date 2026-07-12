import {
  PetConfig,
  SimulationConfig,
  SimulationResult,
} from 'app/domain/interfaces/simulation-config.interface';
import * as foodJson from 'assets/data/food.json';
import * as perksJson from 'assets/data/perks.json';
import * as petsJson from 'assets/data/pets.json';

export type OutFinderSide = 'player' | 'opponent';
export type OutFinderActionType = 'pet' | 'food';

export interface OutFinderAction {
  type: OutFinderActionType;
  name: string;
  replacedIndex: number | null;
  targetIndex: number;
  outcomeDescription?: string;
  lineup: (PetConfig | null)[];
}

export interface OutFinderCandidateResult extends OutFinderAction {
  simulations: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  score: number;
  winDelta: number;
}

export interface OutFinderProgress {
  completedBattles: number;
  totalBattlesEstimate: number;
  testedCandidates: number;
  totalCandidates: number;
}

export interface OutFinderResult {
  side: OutFinderSide;
  pack: string;
  shopTier: number;
  stopReason: 'baseline-perfect' | 'completed';
  baseline: OutFinderCandidateResult;
  candidates: OutFinderCandidateResult[];
  rankedCandidates: OutFinderCandidateResult[];
  simulatedBattles: number;
  aborted: boolean;
}

export interface OutFinderOptions {
  side: OutFinderSide;
  maxSimulationsPerCandidate?: number;
  screeningSimulations?: number;
  finalistCount?: number;
  batchSize?: number;
  baseSeed?: number;
  shopTier?: number;
}

interface CatalogPet {
  Name?: string;
  Attack?: number;
  Health?: number;
  Packs?: string[];
  PacksRequired?: string[];
  Rollable?: boolean;
  Tier?: number;
}

interface CatalogFood {
  Name?: string;
  Ability?: string;
  Packs?: string[];
  PacksRequired?: string[];
  Rollable?: boolean;
  Tier?: number;
}

interface CatalogPerk {
  Name?: string;
}

interface CandidateState extends OutFinderCandidateResult {}

const PACK_NAME_TO_CODE: Readonly<Record<string, string>> = {
  Turtle: 'Pack1',
  Puppy: 'Pack2',
  Star: 'Pack3',
  Golden: 'Pack4',
  Unicorn: 'Pack5',
  Danger: 'Danger',
};

const pets = unwrapJson<CatalogPet>(petsJson);
const foods = unwrapJson<CatalogFood>(foodJson);
const implementedPerks = new Set(
  unwrapJson<CatalogPerk>(perksJson)
    .map((entry) => entry.Name)
    .filter((name): name is string => Boolean(name)),
);
const MINIMUM_DISPLAYED_WIN_DELTA = 0.0005;

export function getOutFinderCatalog(
  config: SimulationConfig,
  side: OutFinderSide,
  shopTier: number = 6,
): {
  pack: string;
  pets: PetConfig[];
  foods: CatalogFood[];
} {
  const pack = side === 'player' ? config.playerPack : config.opponentPack;
  const customPack = config.customPacks?.find((entry) => entry.name === pack);
  const normalizedShopTier = clampShopTier(shopTier);
  const customPetTiers = new Map<string, number>();
  if (customPack) {
    for (let tier = 1; tier <= 6; tier += 1) {
      const names = customPack[`tier${tier}Pets` as keyof typeof customPack] as Array<string | null> | undefined;
      for (const name of names ?? []) {
        if (name) customPetTiers.set(name, tier);
      }
    }
  }
  const customPerks = new Set(customPack?.spells ?? []);
  const packCode = PACK_NAME_TO_CODE[pack] ?? pack;
  const matchesPack = (entry: { Packs?: string[]; PacksRequired?: string[] }, name?: string) =>
    customPack
      ? Boolean(name && (customPetTiers.has(name) || customPerks.has(name)))
      : [...(entry.Packs ?? []), ...(entry.PacksRequired ?? [])].includes(packCode);

  return {
    pack,
    pets: pets
      .filter(
        (entry) =>
          entry.Rollable === true &&
          Boolean(entry.Name) &&
          matchesPack(entry, entry.Name) &&
          (customPack
            ? (customPetTiers.get(entry.Name ?? '') ?? Infinity) <= normalizedShopTier
            : (entry.Tier ?? Infinity) <= normalizedShopTier),
      )
      .map((entry): PetConfig => ({
        name: entry.Name ?? null,
        attack: entry.Attack ?? 0,
        health: entry.Health ?? 0,
        exp: 0,
        equipment: null,
      })),
    foods: foods
      .filter(
        (entry) =>
          entry.Rollable === true &&
          Boolean(entry.Name) &&
          (customPack ? customPerks.has(entry.Name ?? '') : matchesPack(entry, entry.Name)) &&
          (entry.Tier ?? Infinity) <= normalizedShopTier,
      )
      .map((entry) => ({ ...entry })),
  };
}

export function buildOutFinderActions(
  config: SimulationConfig,
  side: OutFinderSide,
  shopTier: number = 6,
): OutFinderAction[] {
  const key = side === 'player' ? 'playerPets' : 'opponentPets';
  const lineup = normalizeLineup(config[key]);
  const catalog = getOutFinderCatalog(config, side, shopTier);
  const actions: OutFinderAction[] = [];
  const occupied = lineup.filter((pet): pet is PetConfig => pet != null);

  for (const pet of catalog.pets) {
    if (occupied.length < 5) {
      for (let position = 0; position <= occupied.length; position += 1) {
        const next = occupied.slice();
        next.splice(position, 0, clonePet(pet));
        actions.push({
          type: 'pet',
          name: pet.name ?? '',
          replacedIndex: null,
          targetIndex: position,
          lineup: normalizeLineup(next),
        });
      }
      continue;
    }
    for (let replacedIndex = 0; replacedIndex < lineup.length; replacedIndex += 1) {
      const survivors = lineup.filter((_, index) => index !== replacedIndex) as PetConfig[];
      for (let position = 0; position < 5; position += 1) {
        const next = survivors.map(clonePet);
        next.splice(position, 0, clonePet(pet));
        actions.push({
          type: 'pet',
          name: pet.name ?? '',
          replacedIndex,
          targetIndex: position,
          lineup: next,
        });
      }
    }
  }

  for (const food of catalog.foods) {
    actions.push(...buildFoodActions(food, lineup));
  }

  return dedupeActions(actions);
}

export function runOutFinder(params: {
  baseConfig: SimulationConfig;
  options: OutFinderOptions;
  simulateBatch: (config: SimulationConfig) => SimulationResult;
  shouldAbort?: () => boolean;
  onProgress?: (progress: OutFinderProgress) => void;
}): OutFinderResult {
  const { baseConfig, options, simulateBatch, shouldAbort, onProgress } = params;
  const side = options.side;
  const key = side === 'player' ? 'playerPets' : 'opponentPets';
  const maxSamples = Math.max(1, Math.trunc(options.maxSimulationsPerCandidate ?? baseConfig.simulationCount ?? 100));
  const screeningSamples = Math.min(maxSamples, Math.max(1, Math.trunc(options.screeningSimulations ?? 25)));
  const finalistCount = Math.max(1, Math.trunc(options.finalistCount ?? 20));
  const batchSize = Math.max(1, Math.trunc(options.batchSize ?? 25));
  const seed = Math.trunc(options.baseSeed ?? baseConfig.seed ?? 123456789);
  const shopTier = clampShopTier(options.shopTier ?? 6);
  const actions = buildOutFinderActions(baseConfig, side, shopTier);
  const states = actions.map(createState);
  const baseline = createState({
    type: 'pet',
    name: 'Current board',
    replacedIndex: null,
    targetIndex: -1,
    lineup: normalizeLineup(baseConfig[key]),
  });
  let completedBattles = 0;
  let aborted = false;
  const totalBattlesEstimate = maxSamples + states.length * screeningSamples + Math.min(finalistCount, states.length) * (maxSamples - screeningSamples);

  const runTo = (state: CandidateState, target: number): void => {
    while (state.simulations < target && !shouldAbort?.()) {
      const count = Math.min(batchSize, target - state.simulations);
      const result = simulateBatch({
        ...baseConfig,
        [key]: state.lineup,
        simulationCount: count,
        logsEnabled: false,
        maxLoggedBattles: 0,
        captureRandomDecisions: false,
        randomDecisionOverrides: [],
        seed: seed + state.simulations,
      });
      addResult(state, result, count, side);
      completedBattles += count;
      onProgress?.({
        completedBattles,
        totalBattlesEstimate,
        testedCandidates: states.filter((candidate) => candidate.simulations > 0).length,
        totalCandidates: states.length,
      });
    }
    if (shouldAbort?.()) aborted = true;
  };

  runTo(baseline, maxSamples);
  if (baseline.winRate === 1) {
    return {
      side,
      pack: getOutFinderCatalog(baseConfig, side, shopTier).pack,
      shopTier,
      stopReason: 'baseline-perfect',
      baseline,
      candidates: [],
      rankedCandidates: [],
      simulatedBattles: completedBattles,
      aborted,
    };
  }
  for (const state of states) {
    if (aborted) break;
    runTo(state, screeningSamples);
  }
  const finalists = [...states]
    .sort(compareCandidates)
    .slice(0, finalistCount);
  for (const finalist of finalists) {
    if (aborted) break;
    runTo(finalist, maxSamples);
  }
  for (const state of states) state.winDelta = state.winRate - baseline.winRate;
  const improvingFinalists = finalists.filter(
    (candidate) => candidate.winDelta >= MINIMUM_DISPLAYED_WIN_DELTA,
  );

  return {
    side,
    pack: getOutFinderCatalog(baseConfig, side, shopTier).pack,
    shopTier,
    stopReason: 'completed',
    baseline,
    candidates: states,
    rankedCandidates: improvingFinalists.sort(compareCandidates),
    simulatedBattles: completedBattles,
    aborted,
  };
}

function buildFoodActions(
  food: CatalogFood,
  lineup: (PetConfig | null)[],
): OutFinderAction[] {
  const name = food.Name;
  const ability = food.Ability ?? '';
  if (!name) return [];
  const occupiedIndices = lineup
    .map((pet, index) => (pet ? index : -1))
    .filter((index) => index >= 0);
  if (!occupiedIndices.length) return [];

  const perkMatch = /^Give one pet the (.+) perk\.$/i.exec(ability);
  if (perkMatch && implementedPerks.has(name)) {
    return occupiedIndices.map((targetIndex) => {
      const next = lineup.map(clonePet);
      next[targetIndex] = {
        ...next[targetIndex]!,
        equipment: { name },
        foodsEaten: (next[targetIndex]?.foodsEaten ?? 0) + 1,
      };
      return createFoodAction(name, targetIndex, next);
    });
  }

  const experienceMatch = /^Give one pet \+(\d+) experience\.$/i.exec(ability);
  if (experienceMatch) {
    const experience = Number(experienceMatch[1]);
    return occupiedIndices.map((targetIndex) => {
      const next = lineup.map(clonePet);
      next[targetIndex] = {
        ...next[targetIndex]!,
        exp: (next[targetIndex]?.exp ?? 0) + experience,
        foodsEaten: (next[targetIndex]?.foodsEaten ?? 0) + 1,
      };
      return createFoodAction(name, targetIndex, next);
    });
  }

  if (/^Swap Attack and Health of a pet\./i.test(ability)) {
    return occupiedIndices.map((targetIndex) => {
      const next = lineup.map(clonePet);
      const target = next[targetIndex]!;
      next[targetIndex] = {
        ...target,
        attack: target.health ?? 0,
        health: target.attack ?? 0,
        foodsEaten: (target.foodsEaten ?? 0) + 1,
      };
      return createFoodAction(name, targetIndex, next);
    });
  }

  if (/^Balance out attack and health\./i.test(ability)) {
    return occupiedIndices.map((targetIndex) => {
      const next = lineup.map(clonePet);
      const target = next[targetIndex]!;
      const balanced = Math.max(target.attack ?? 0, target.health ?? 0);
      next[targetIndex] = {
        ...target,
        attack: balanced,
        health: balanced,
        foodsEaten: (target.foodsEaten ?? 0) + 1,
      };
      return createFoodAction(name, targetIndex, next);
    });
  }

  const randomTargetsMatch = /^Give (two|three) random pets (.+)\.$/i.exec(ability);
  if (randomTargetsMatch) {
    const targetCount = randomTargetsMatch[1].toLowerCase() === 'two' ? 2 : 3;
    const statDelta = parseFoodStatDelta(randomTargetsMatch[2]);
    if (!statDelta || occupiedIndices.length < targetCount) return [];
    return combinations(occupiedIndices, targetCount).map((targets) => {
      const next = applyFoodStats(
        lineup,
        targets,
        statDelta.attack,
        statDelta.health,
        statDelta.lowestStat,
      );
      return createFoodAction(
        name,
        targets[0],
        next,
        `Lucky targets: ${formatTargetList(targets)}`,
      );
    });
  }

  const allPetsMatch = /^Give all pets (.+)\.$/i.exec(ability);
  if (allPetsMatch) {
    const statDelta = parseFoodStatDelta(allPetsMatch[1]);
    if (!statDelta) return [];
    return [createFoodAction(
      name,
      -1,
      applyFoodStats(
        lineup,
        occupiedIndices,
        statDelta.attack,
        statDelta.health,
        statDelta.lowestStat,
      ),
      'All pets',
    )];
  }

  const singlePetMatch = /^Give one pet (.+)\.$/i.exec(ability);
  if (singlePetMatch) {
    const statDelta = parseFoodStatDelta(singlePetMatch[1]);
    if (!statDelta) return [];
    return occupiedIndices.map((targetIndex) =>
      createFoodAction(
        name,
        targetIndex,
        applyFoodStats(
          lineup,
          [targetIndex],
          statDelta.attack,
          statDelta.health,
          statDelta.lowestStat,
        ),
      ),
    );
  }

  return [];
}

function createFoodAction(
  name: string,
  targetIndex: number,
  lineup: (PetConfig | null)[],
  outcomeDescription?: string,
): OutFinderAction {
  return {
    type: 'food',
    name,
    replacedIndex: null,
    targetIndex,
    lineup,
    outcomeDescription,
  };
}

function parseFoodStatDelta(
  text: string,
): { attack: number; health: number; lowestStat?: number } | null {
  let attack = 0;
  let health = 0;
  for (const match of text.matchAll(/\+(\d+) attack/gi)) attack += Number(match[1]);
  for (const match of text.matchAll(/\+(\d+) health/gi)) health += Number(match[1]);
  for (const match of text.matchAll(/remove (\d+) attack/gi)) attack -= Number(match[1]);
  for (const match of text.matchAll(/remove (\d+) health/gi)) health -= Number(match[1]);
  const lowestStatMatch = /\+(\d+) to (?:their|its) lowest stat/i.exec(text);
  if (lowestStatMatch) {
    return { attack: 0, health: 0, lowestStat: Number(lowestStatMatch[1]) };
  }
  return attack || health ? { attack, health } : null;
}

function applyFoodStats(
  lineup: (PetConfig | null)[],
  targetIndices: number[],
  attackDelta: number,
  healthDelta: number,
  lowestStatDelta?: number,
): (PetConfig | null)[] {
  const targets = new Set(targetIndices);
  return lineup.map((pet, index) => {
    if (!pet || !targets.has(index)) return clonePet(pet);
    let attack = (pet.attack ?? 0) + attackDelta;
    let health = (pet.health ?? 0) + healthDelta;
    if (lowestStatDelta != null) {
      if ((pet.attack ?? 0) <= (pet.health ?? 0)) attack += lowestStatDelta;
      if ((pet.health ?? 0) <= (pet.attack ?? 0)) health += lowestStatDelta;
    }
    return { ...clonePet(pet)!, attack, health, foodsEaten: (pet.foodsEaten ?? 0) + 1 };
  });
}

function combinations<T>(items: T[], count: number): T[][] {
  if (count === 0) return [[]];
  if (items.length < count) return [];
  const [first, ...rest] = items;
  return [
    ...combinations(rest, count - 1).map((combination) => [first, ...combination]),
    ...combinations(rest, count),
  ];
}

function formatTargetList(indices: number[]): string {
  return indices.map((index) => `Pet ${index + 1}`).join(' & ');
}

function createState(action: OutFinderAction): CandidateState {
  return { ...action, simulations: 0, wins: 0, draws: 0, losses: 0, winRate: 0, score: 0, winDelta: 0 };
}

function addResult(state: CandidateState, result: SimulationResult, count: number, side: OutFinderSide): void {
  state.simulations += count;
  state.wins += side === 'player' ? result.playerWins : result.opponentWins;
  state.losses += side === 'player' ? result.opponentWins : result.playerWins;
  state.draws += result.draws;
  state.winRate = state.wins / state.simulations;
  state.score = (state.wins + state.draws * 0.5) / state.simulations;
}

function compareCandidates(a: CandidateState, b: CandidateState): number {
  return b.winRate - a.winRate || b.score - a.score || a.name.localeCompare(b.name);
}

function normalizeLineup(lineup: (PetConfig | null)[] | undefined): (PetConfig | null)[] {
  const normalized = (lineup ?? []).slice(0, 5).map(clonePet);
  while (normalized.length < 5) normalized.push(null);
  return normalized;
}

function clonePet(pet: PetConfig | null): PetConfig | null {
  return pet ? { ...pet, equipment: pet.equipment ? { ...pet.equipment } : null } : null;
}

function dedupeActions(actions: OutFinderAction[]): OutFinderAction[] {
  const seen = new Set<string>();
  return actions.filter((action) => {
    const signature = JSON.stringify(action.lineup);
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}

function unwrapJson<T>(source: unknown): T[] {
  const value = (source as { default?: unknown }).default ?? source;
  return Array.isArray(value) ? (value as T[]) : [];
}

function clampShopTier(value: number): number {
  return Math.min(6, Math.max(1, Math.trunc(value)));
}
