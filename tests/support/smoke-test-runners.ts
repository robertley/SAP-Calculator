import { runSimulation } from '../../simulation/simulate';
import {
  PetConfig,
  SimulationConfig,
  SimulationResult,
} from '../../src/app/domain/interfaces/simulation-config.interface';

type PackName =
  | 'Turtle'
  | 'Puppy'
  | 'Star'
  | 'Golden'
  | 'Unicorn'
  | 'Danger'
  | 'Custom';

type AbilityScope = 'battle' | 'shop' | 'none' | 'unknown';

type SmokeOptions = {
  playerPack?: PackName;
  opponentPack?: PackName;
};

type BattleLog = {
  type?: string;
  message?: string;
  rawMessage?: string;
  player?: { isOpponent?: boolean } | null;
  playerIsOpponent?: boolean;
};

const DEFAULT_BEHAVIOR_SEED = 1337;
const DEFAULT_CONTROL_PET = 'Beaver';

const SHOP_TRIGGER_PREFIXES = [
  'start of turn',
  'end turn',
  'break',
  'sell',
  'buy',
  'friend sold',
  'friend bought',
  'friendly level-up',
  'level-up',
  'shop',
  'roll',
  'three friends bought',
  'spend',
  'food bought',
  'eats',
  'eat',
  'pet sold',
];

const BATTLE_TRIGGER_PREFIXES = [
  'before battle',
  'start of battle',
  'before attack',
  'after attack',
  'faint',
  'hurt',
  'friend summoned',
  'summoned',
  'friend faints',
  'friend hurt',
  'friend ahead',
  'enemy summoned',
  'enemy hurt',
  'enemy faints',
  'enemy gained ailment',
  'friendly attacked',
  'friend attacked',
  'adjacent friend attacked',
  'before friend attacks',
  'before any attack',
  'before first attack',
  'empty front space',
  'knock out',
  'anyone',
  'bee summoned',
  'pet flung',
  'enemy',
];

const getAbilityPrefix = (abilityText: string): string => {
  const idx = abilityText.indexOf(':');
  if (idx < 0) {
    return '';
  }
  return abilityText.slice(0, idx).trim().toLowerCase();
};

export const classifyAbilityScope = (
  abilityText?: string | null,
): AbilityScope => {
  if (!abilityText) {
    return 'none';
  }
  const text = abilityText.trim();
  if (!text || /^No ability\./i.test(text)) {
    return 'none';
  }

  const prefix = getAbilityPrefix(text);
  if (prefix) {
    if (SHOP_TRIGGER_PREFIXES.some((token) => prefix.includes(token))) {
      return 'shop';
    }
    if (BATTLE_TRIGGER_PREFIXES.some((token) => prefix.includes(token))) {
      return 'battle';
    }
  }

  const lowered = text.toLowerCase();
  if (!prefix) {
    if (
      /\b(start of battle|before battle|before attack|after attack|faint|hurt|summon|empty front space|knock out|enemy summoned|friend summoned)\b/.test(
        lowered,
      )
    ) {
      return 'battle';
    }
    if (
      /\b(start of turn|end turn|break|sell|buy|roll|shop|food|level-?up|spend \d+ gold|tier)\b/.test(
        lowered,
      )
    ) {
      return 'shop';
    }
    return 'unknown';
  }

  if (
    /\b(start of battle|before battle|before attack|after attack|faint|hurt|summon|attack|enemy|empty front space|knock out|jump)\b/.test(
      lowered,
    )
  ) {
    return 'battle';
  }
  if (
    /\b(start of turn|end turn|sell|buy|roll|shop|food|level-?up|spend \d+ gold|tier)\b/.test(
      lowered,
    )
  ) {
    return 'shop';
  }
  return 'unknown';
};

const createBaseConfig = (
  options: SmokeOptions = {},
): SimulationConfig => ({
  playerPack: options.playerPack ?? 'Custom',
  opponentPack: options.opponentPack ?? options.playerPack ?? 'Custom',
  turn: 1,
  simulationCount: 1,
  oldStork: false,
  tokenPets: false,
  komodoShuffle: false,
  mana: true,
  playerGoldSpent: 0,
  opponentGoldSpent: 0,
  playerRollAmount: 0,
  opponentRollAmount: 0,
  playerLevel3Sold: 0,
  opponentLevel3Sold: 0,
  playerSummonedAmount: 0,
  opponentSummonedAmount: 0,
  playerTransformationAmount: 0,
  opponentTransformationAmount: 0,
  playerPets: [null, null, null, null, null],
  opponentPets: [null, null, null, null, null],
});

const createPet = (
  name: string,
  overrides: Partial<PetConfig> = {},
): PetConfig => ({
  name,
  attack: 4,
  health: 4,
  exp: 0,
  mana: 0,
  triggersConsumed: 0,
  equipment: null,
  belugaSwallowedPet: null,
  abominationSwallowedPet1: null,
  abominationSwallowedPet2: null,
  abominationSwallowedPet3: null,
  battlesFought: 0,
  timesHurt: 0,
  ...overrides,
});

const createBehaviorConfig = (options: SmokeOptions = {}): SimulationConfig => {
  const config = createBaseConfig(options);
  config.simulationCount = 1;
  config.logsEnabled = true;
  config.maxLoggedBattles = 1;
  config.seed = DEFAULT_BEHAVIOR_SEED;
  return config;
};

const runSmoke = (config: SimulationConfig): SimulationResult => {
  const result = runSimulation(config);
  expect(Number.isFinite(result.playerWins)).toBe(true);
  expect(Number.isFinite(result.opponentWins)).toBe(true);
  expect(Number.isFinite(result.draws)).toBe(true);
  return result;
};

const getBattleLogs = (result: SimulationResult): BattleLog[] =>
  (result.battles?.[0]?.logs ?? []) as BattleLog[];

const normalizeLogText = (log: BattleLog): string =>
  String(log.rawMessage ?? log.message ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const isAbilityLikeLog = (log: BattleLog): boolean =>
  log.type === 'ability' || log.type === 'equipment';

const isBehaviorLog = (log: BattleLog): boolean => {
  const text = normalizeLogText(log);
  if (!text) {
    return false;
  }
  return text !== 'player is the winner' && text !== 'opponent is the winner';
};

const abilityTrace = (logs: BattleLog[]): string[] =>
  logs.filter(isAbilityLikeLog).map(normalizeLogText);

const behaviorTrace = (logs: BattleLog[]): string[] =>
  logs.filter(isBehaviorLog).map(normalizeLogText);

const canonicalizeTrace = (
  trace: string[],
  replacements: Array<{ from: string; to: string }>,
): string[] => {
  if (replacements.length === 0) {
    return trace;
  }
  return trace.map((line) => {
    let value = line;
    for (const replacement of replacements) {
      const from = replacement.from.toLowerCase();
      if (!from) {
        continue;
      }
      value = value.split(from).join(replacement.to);
    }
    return value;
  });
};

const namedAbilityLogs = (logs: BattleLog[], entityName: string): BattleLog[] => {
  const needle = entityName.toLowerCase();
  return logs.filter(
    (log) => isAbilityLikeLog(log) && normalizeLogText(log).includes(needle),
  );
};

const namedBehaviorLogs = (logs: BattleLog[], entityName: string): BattleLog[] => {
  const needle = entityName.toLowerCase();
  return logs.filter(
    (log) => isBehaviorLog(log) && normalizeLogText(log).includes(needle),
  );
};

type PetBehaviorScenario =
  | 'default'
  | 'faint'
  | 'hurt'
  | 'friend'
  | 'summon'
  | 'empty-front'
  | 'attack';

type ToyBehaviorScenario =
  | 'default'
  | 'faint'
  | 'empty-front'
  | 'friend-summoned';

type EquipmentBehaviorScenario =
  | 'default'
  | 'faint'
  | 'hurt'
  | 'attack'
  | 'empty-front';

const petScenarioForAbility = (abilityText?: string | null): PetBehaviorScenario => {
  const text = `${abilityText ?? ''}`.toLowerCase();
  if (text.includes('empty front space')) {
    return 'empty-front';
  }
  if (/\benemy summoned|friend summoned|summoned\b/.test(text)) {
    return 'summon';
  }
  if (
    /\bfriend ahead|pet ahead|nearest pet ahead|friendly attacked|friend attacked|adjacent friend attacked|friend hurt|friend faints|friends faint|anyone behind hurt|anyone hurt\b/.test(
      text,
    )
  ) {
    return 'friend';
  }
  if (/\bhurt\b/.test(text)) {
    return 'hurt';
  }
  if (/\bfaint\b/.test(text)) {
    return 'faint';
  }
  if (/\bbefore attack|after attack|knock out|attacked|attack\b/.test(text)) {
    return 'attack';
  }
  return 'default';
};

const toyScenarioForAbility = (abilityText?: string | null): ToyBehaviorScenario => {
  const text = `${abilityText ?? ''}`.toLowerCase();
  if (text.includes('empty front space')) {
    return 'empty-front';
  }
  if (text.includes('friend summoned')) {
    return 'friend-summoned';
  }
  if (/\bfaint\b/.test(text)) {
    return 'faint';
  }
  return 'default';
};

const equipmentScenarioForAbility = (
  abilityText?: string | null,
): EquipmentBehaviorScenario => {
  const text = `${abilityText ?? ''}`.toLowerCase();
  if (text.includes('empty front space')) {
    return 'empty-front';
  }
  if (/\bhurt\b/.test(text)) {
    return 'hurt';
  }
  if (/\bfaint\b/.test(text)) {
    return 'faint';
  }
  if (/\bbefore attack|knock out|anyone attacks|attack\b/.test(text)) {
    return 'attack';
  }
  return 'default';
};

const configurePetScenario = (
  config: SimulationConfig,
  petName: string,
  scenario: PetBehaviorScenario,
) => {
  switch (scenario) {
    case 'empty-front':
      config.playerPets[1] = createPet(petName, { attack: 6, health: 7, mana: 6 });
      config.playerPets[2] = createPet('Pig', { attack: 4, health: 5 });
      config.opponentPets[0] = createPet('Pig', { attack: 6, health: 8 });
      break;
    case 'summon':
      config.playerPets[0] = createPet('Pig', {
        attack: 1,
        health: 1,
        equipment: { name: 'Honey' },
      });
      config.playerPets[1] = createPet(petName, { attack: 6, health: 6, mana: 6 });
      config.opponentPets[0] = createPet('Pig', {
        attack: 1,
        health: 1,
        equipment: { name: 'Honey' },
      });
      config.opponentPets[1] = createPet('Pig', { attack: 7, health: 8 });
      break;
    case 'friend':
      config.playerPets[0] = createPet('Pig', { attack: 2, health: 1 });
      config.playerPets[1] = createPet(petName, { attack: 6, health: 7, mana: 6 });
      config.opponentPets[0] = createPet('Pig', { attack: 8, health: 8 });
      break;
    case 'hurt':
      config.playerPets[0] = createPet(petName, { attack: 2, health: 14, mana: 6 });
      config.playerPets[1] = createPet('Pig', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 3, health: 20 });
      break;
    case 'faint':
      config.playerPets[0] = createPet(petName, { attack: 2, health: 1, mana: 6 });
      config.playerPets[1] = createPet('Pig', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 10, health: 10 });
      break;
    case 'attack':
      config.playerPets[0] = createPet(petName, { attack: 10, health: 6, mana: 6 });
      config.playerPets[1] = createPet('Pig', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 3, health: 4 });
      config.opponentPets[1] = createPet('Pig', { attack: 5, health: 6 });
      break;
    default:
      config.playerPets[0] = createPet(petName, { attack: 7, health: 7, mana: 6 });
      config.playerPets[1] = createPet('Pig', { attack: 4, health: 5 });
      config.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      config.opponentPets[1] = createPet('Pig', { attack: 4, health: 4 });
      break;
  }
};

const configureToyScenario = (
  config: SimulationConfig,
  toyName: string,
  scenario: ToyBehaviorScenario,
) => {
  config.playerToy = toyName;
  config.playerToyLevel = 1;
  switch (scenario) {
    case 'empty-front':
      config.playerPets[1] = createPet('Pig', { attack: 4, health: 4 });
      config.playerPets[2] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      break;
    case 'faint':
      config.playerPets[0] = createPet('Pig', { attack: 1, health: 1 });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 10, health: 10 });
      break;
    case 'friend-summoned':
      config.playerPets[0] = createPet('Pig', {
        attack: 1,
        health: 1,
        equipment: { name: 'Honey' },
      });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', {
        attack: 1,
        health: 1,
        equipment: { name: 'Honey' },
      });
      config.opponentPets[1] = createPet('Pig', { attack: 7, health: 8 });
      break;
    default:
      config.playerPets[0] = createPet('Pig', { attack: 5, health: 5 });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 5 });
      config.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      config.opponentPets[1] = createPet('Fish', { attack: 5, health: 6 });
      break;
  }
};

const configureEquipmentScenario = (
  config: SimulationConfig,
  equipmentName: string,
  scenario: EquipmentBehaviorScenario,
) => {
  const equipPet = (overrides: Partial<PetConfig>) =>
    createPet('Pig', {
      attack: 5,
      health: 5,
      equipment: { name: equipmentName },
      ...overrides,
    });

  switch (scenario) {
    case 'empty-front':
      config.playerPets[1] = equipPet({ attack: 6, health: 7 });
      config.playerPets[2] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 6, health: 8 });
      break;
    case 'hurt':
      config.playerPets[0] = equipPet({ attack: 2, health: 14 });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 3, health: 20 });
      break;
    case 'faint':
      config.playerPets[0] = equipPet({ attack: 2, health: 1 });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', { attack: 10, health: 10 });
      break;
    case 'attack':
      config.playerPets[0] = equipPet({ attack: 10, health: 6 });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      config.opponentPets[0] = createPet('Pig', {
        attack: 3,
        health: 4,
        equipment: { name: 'Garlic' },
      });
      config.opponentPets[1] = createPet('Pig', { attack: 5, health: 6 });
      break;
    default:
      config.playerPets[0] = equipPet({ attack: 7, health: 7 });
      config.playerPets[1] = createPet('Fish', { attack: 4, health: 5 });
      config.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      config.opponentPets[1] = createPet('Fish', { attack: 5, health: 6 });
      break;
  }
};

const assertBehaviorDelta = (params: {
  entityName: string;
  abilityText?: string | null;
  controlEntityName?: string;
  variant: SimulationResult;
  control: SimulationResult;
}) => {
  expect(Number.isFinite(params.variant.playerWins)).toBe(true);
  expect(Number.isFinite(params.variant.opponentWins)).toBe(true);
  expect(Number.isFinite(params.variant.draws)).toBe(true);
  expect(Number.isFinite(params.control.playerWins)).toBe(true);
  expect(Number.isFinite(params.control.opponentWins)).toBe(true);
  expect(Number.isFinite(params.control.draws)).toBe(true);

  const variantLogs = getBattleLogs(params.variant);
  const controlLogs = getBattleLogs(params.control);
  const variantAbilityTrace = abilityTrace(variantLogs);
  const controlAbilityTrace = abilityTrace(controlLogs);
  const variantBehaviorTrace = behaviorTrace(variantLogs);
  const controlBehaviorTrace = behaviorTrace(controlLogs);
  const canonicalVariantTrace = canonicalizeTrace(variantBehaviorTrace, [
    { from: params.entityName, to: '__entity__' },
  ]);
  const canonicalControlTrace = canonicalizeTrace(controlBehaviorTrace, [
    { from: params.controlEntityName ?? '', to: '__entity__' },
  ]);

  expect(canonicalVariantTrace).not.toEqual(canonicalControlTrace);

  const matchedByName = namedAbilityLogs(variantLogs, params.entityName);
  if (matchedByName.length > 0) {
    expect(variantAbilityTrace).not.toEqual(controlAbilityTrace);
    return;
  }

  const fallbackMatches = namedBehaviorLogs(variantLogs, params.entityName);
  expect(fallbackMatches.length).toBeGreaterThan(0);
};

export const runPetSmoke = (params: {
  petName: string;
  playerPack?: PackName;
  opponentPack?: PackName;
}): SimulationResult => {
  const config = createBaseConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  config.playerPets[0] = createPet(params.petName);
  config.opponentPets[0] = createPet('Ant');
  return runSmoke(config);
};

export const runToySmoke = (params: {
  toyName: string;
  playerPack?: PackName;
  opponentPack?: PackName;
}): SimulationResult => {
  const config = createBaseConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  config.playerToy = params.toyName;
  config.playerToyLevel = 1;
  config.playerPets[0] = createPet('Ant');
  config.opponentPets[0] = createPet('Fish');
  return runSmoke(config);
};

export const runPetBehavior = (params: {
  petName: string;
  abilityText?: string | null;
  playerPack?: PackName;
  opponentPack?: PackName;
}): void => {
  const scenario = petScenarioForAbility(params.abilityText);
  const variant = createBehaviorConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  configurePetScenario(variant, params.petName, scenario);

  const control = createBehaviorConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  configurePetScenario(control, DEFAULT_CONTROL_PET, scenario);

  assertBehaviorDelta({
    entityName: params.petName,
    abilityText: params.abilityText,
    controlEntityName: DEFAULT_CONTROL_PET,
    variant: runSimulation(variant),
    control: runSimulation(control),
  });
};

export const runToyBehavior = (params: {
  toyName: string;
  abilityText?: string | null;
  playerPack?: PackName;
  opponentPack?: PackName;
}): void => {
  const scenario = toyScenarioForAbility(params.abilityText);
  const variant = createBehaviorConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  configureToyScenario(variant, params.toyName, scenario);

  const control = createBehaviorConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  switch (scenario) {
    case 'empty-front':
      control.playerPets[1] = createPet('Pig', { attack: 4, health: 4 });
      control.playerPets[2] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      break;
    case 'faint':
      control.playerPets[0] = createPet('Pig', { attack: 1, health: 1 });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', { attack: 10, health: 10 });
      break;
    case 'friend-summoned':
      control.playerPets[0] = createPet('Pig', {
        attack: 1,
        health: 1,
        equipment: { name: 'Honey' },
      });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', {
        attack: 1,
        health: 1,
        equipment: { name: 'Honey' },
      });
      control.opponentPets[1] = createPet('Pig', { attack: 7, health: 8 });
      break;
    default:
      control.playerPets[0] = createPet('Pig', { attack: 5, health: 5 });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 5 });
      control.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      control.opponentPets[1] = createPet('Fish', { attack: 5, health: 6 });
      break;
  }

  assertBehaviorDelta({
    entityName: params.toyName,
    abilityText: params.abilityText,
    variant: runSimulation(variant),
    control: runSimulation(control),
  });
};

export const runEquipmentBehavior = (params: {
  equipmentName: string;
  abilityText?: string | null;
  playerPack?: PackName;
  opponentPack?: PackName;
}): void => {
  const scenario = equipmentScenarioForAbility(params.abilityText);
  const variant = createBehaviorConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  configureEquipmentScenario(variant, params.equipmentName, scenario);

  const control = createBehaviorConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  const plainPet = (overrides: Partial<PetConfig>) =>
    createPet('Pig', {
      attack: 5,
      health: 5,
      ...overrides,
    });
  switch (scenario) {
    case 'empty-front':
      control.playerPets[1] = plainPet({ attack: 6, health: 7 });
      control.playerPets[2] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', { attack: 6, health: 8 });
      break;
    case 'hurt':
      control.playerPets[0] = plainPet({ attack: 2, health: 14 });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', { attack: 3, health: 20 });
      break;
    case 'faint':
      control.playerPets[0] = plainPet({ attack: 2, health: 1 });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', { attack: 10, health: 10 });
      break;
    case 'attack':
      control.playerPets[0] = plainPet({ attack: 10, health: 6 });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 4 });
      control.opponentPets[0] = createPet('Pig', {
        attack: 3,
        health: 4,
        equipment: { name: 'Garlic' },
      });
      control.opponentPets[1] = createPet('Pig', { attack: 5, health: 6 });
      break;
    default:
      control.playerPets[0] = plainPet({ attack: 7, health: 7 });
      control.playerPets[1] = createPet('Fish', { attack: 4, health: 5 });
      control.opponentPets[0] = createPet('Pig', { attack: 6, health: 7 });
      control.opponentPets[1] = createPet('Fish', { attack: 5, health: 6 });
      break;
  }

  assertBehaviorDelta({
    entityName: params.equipmentName,
    abilityText: params.abilityText,
    variant: runSimulation(variant),
    control: runSimulation(control),
  });
};

export const runEquipmentSmoke = (params: {
  equipmentName: string;
  playerPack?: PackName;
  opponentPack?: PackName;
}): SimulationResult => {
  const config = createBaseConfig({
    playerPack: params.playerPack,
    opponentPack: params.opponentPack,
  });
  config.playerPets[0] = createPet('Ant', {
    equipment: { name: params.equipmentName },
  });
  config.opponentPets[0] = createPet('Fish');
  return runSmoke(config);
};
