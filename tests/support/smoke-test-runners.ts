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

type SmokeOptions = {
  playerPack?: PackName;
  opponentPack?: PackName;
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

const runSmoke = (config: SimulationConfig): SimulationResult => {
  const result = runSimulation(config);
  expect(Number.isFinite(result.playerWins)).toBe(true);
  expect(Number.isFinite(result.opponentWins)).toBe(true);
  expect(Number.isFinite(result.draws)).toBe(true);
  return result;
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
