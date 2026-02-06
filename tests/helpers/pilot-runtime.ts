import { runSimulation } from '../../simulation/simulate';
import {
  PetConfig,
  SimulationConfig,
} from '../../src/app/interfaces/simulation-config.interface';

type PackName =
  | 'Turtle'
  | 'Puppy'
  | 'Star'
  | 'Golden'
  | 'Unicorn'
  | 'Danger'
  | 'Custom';

type BattleLog = {
  type?: string;
  message?: string;
};

export const createBaseConfig = (
  pack: PackName = 'Custom',
): SimulationConfig => ({
  playerPack: pack,
  opponentPack: pack,
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

export const createPet = (
  name: string,
  overrides: Partial<PetConfig> = {},
): PetConfig => ({
  name,
  attack: 4,
  health: 4,
  exp: 0,
  mana: 0,
  triggersConsumed: 0,
  foodsEaten: 0,
  equipment: null,
  belugaSwallowedPet: null,
  abominationSwallowedPet1: null,
  abominationSwallowedPet2: null,
  abominationSwallowedPet3: null,
  battlesFought: 0,
  timesHurt: 0,
  ...overrides,
});

export const runBattleLogs = (config: SimulationConfig): BattleLog[] => {
  const result = runSimulation(config);
  return (result.battles?.[0]?.logs ?? []) as BattleLog[];
};

export const hasNamedLog = (
  logs: BattleLog[],
  name: string,
  types: string[] = ['ability', 'equipment'],
): boolean => {
  const needle = name.toLowerCase();
  return logs.some((log) => {
    const message = String(log?.message ?? '').toLowerCase();
    return types.includes(String(log?.type ?? '')) && message.includes(needle);
  });
};
