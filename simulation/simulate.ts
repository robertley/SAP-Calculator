import { SimulationRunner } from '../src/app/gameplay/simulation-runner';
import {
  SimulationConfig,
  SimulationResult,
} from '../src/app/domain/interfaces/simulation-config.interface';
import { LogService } from '../src/app/integrations/log.service';
import { GameService } from '../src/app/runtime/state/game.service';
import { AbilityService } from '../src/app/integrations/ability/ability.service';
import { AbilityQueueService } from '../src/app/integrations/ability/ability-queue.service';
import { AttackEventService } from '../src/app/integrations/ability/attack-event.service';
import { FaintEventService } from '../src/app/integrations/ability/faint-event.service';
import { ToyEventService } from '../src/app/integrations/ability/toy-event.service';
import { PetService } from '../src/app/integrations/pet/pet.service';
import { EquipmentService } from '../src/app/integrations/equipment/equipment.service';
import { ToyService } from '../src/app/integrations/toy/toy.service';
import { PetFactoryService } from '../src/app/integrations/pet/pet-factory.service';
import { EquipmentFactoryService } from '../src/app/integrations/equipment/equipment-factory.service';
import { ToyFactoryService } from '../src/app/integrations/toy/toy-factory.service';
import { InjectorService } from '../src/app/integrations/injector.service';
import {
  parseTeamwoodReplayForCalculator,
  ReplayActionsContainerJson,
  ReplayBotTurnsContainerJson,
  ReplayCalculatorState,
  ReplayMetaBoards,
  ReplayParseOptions,
  ReplayCalcParser,
} from '../src/app/integrations/replay/replay-calc-parser';

class NodeInjector {
  private map = new Map<string | any, any>();
  register(token: any, instance: any) {
    const key = token.name || token;
    this.map.set(key, instance);
  }
  get(token: any) {
    const key = token.name || token;
    return this.map.get(key);
  }
}

function createSimulationRunner(logService: LogService): SimulationRunner {
  const gameService = new GameService();
  const abilityQueueService = new AbilityQueueService();
  const toyEventService = new ToyEventService(gameService, logService);
  const attackEventService = new AttackEventService(abilityQueueService);
  const faintEventService = new FaintEventService(
    abilityQueueService,
    toyEventService,
  );
  const abilityService = new AbilityService(
    gameService,
    logService,
    toyEventService,
    abilityQueueService,
    attackEventService,
    faintEventService,
  );

  // Equipment Logic
  const equipmentFactory = new EquipmentFactoryService(
    logService,
    abilityService,
    gameService,
  );
  const equipmentService = new EquipmentService(
    logService,
    abilityService,
    gameService,
    equipmentFactory,
  );

  // Pet Logic
  const petFactory = new PetFactoryService(
    logService,
    abilityService,
    gameService,
    equipmentService,
  );
  const petService = new PetService(
    logService,
    abilityService,
    gameService,
    petFactory,
  );

  // Setup Injector for EquipmentFactory/EquipmentService
  const injector = new NodeInjector();
  injector.register(PetService, petService);
  injector.register(EquipmentService, equipmentService);
  injector.register(AbilityService, abilityService);
  injector.register(LogService, logService);
  injector.register(AbilityQueueService, abilityQueueService);
  const toyFactory = new ToyFactoryService(logService, abilityService);
  const toyService = new ToyService(
    logService,
    abilityService,
    gameService,
    equipmentService,
    petService,
    toyFactory,
  );
  injector.register(ToyService, toyService);
  injector.register(PetFactoryService, petFactory);
  InjectorService.setInjector(injector as any);

  // Initialize pet data
  petService.init();

  const runner = new SimulationRunner(
    logService,
    gameService,
    abilityService,
    petService,
    equipmentService,
    toyService,
  );

  return runner;
}

export function runSimulation(config: SimulationConfig): SimulationResult {
  const logService = new LogService();
  const runner = createSimulationRunner(logService);
  return runner.run(config);
}

export interface HeadlessSimulationOptions {
  enableLogs?: boolean;
  includeBattles?: boolean;
}

export function runHeadlessSimulation(
  config: SimulationConfig,
  options: HeadlessSimulationOptions = {},
): SimulationResult {
  const logService = new LogService();
  const logsEnabled = options.enableLogs ?? config.logsEnabled ?? false;
  const runner = createSimulationRunner(logService);
  const result = runner.run({
    ...config,
    logsEnabled,
  });
  if (!options.includeBattles) {
    delete result.battles;
  }
  return result;
}

export type ReplayPayloadJson =
  | ReplayActionsContainerJson
  | ReplayBotTurnsContainerJson;

function toNumberOrFallback(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function normalizeCalculatorBaseUrl(baseUrl?: string): URL {
  const fallbackUrl = 'https://sap-calculator.com/';
  const candidate = typeof baseUrl === 'string' && baseUrl.trim().length > 0
    ? baseUrl.trim()
    : fallbackUrl;
  try {
    return new URL(candidate);
  } catch {
    return new URL(fallbackUrl);
  }
}

export function parseReplayCalculatorState(
  replay: ReplayPayloadJson,
  turnNumber: number,
  metaBoards?: ReplayMetaBoards,
  options?: ReplayParseOptions,
): ReplayCalculatorState | null {
  return parseTeamwoodReplayForCalculator(
    replay,
    turnNumber,
    metaBoards,
    options,
  );
}

export function createSimulationConfigFromCalculatorState(
  calculatorState: ReplayCalculatorState,
  simulationCount: number,
): SimulationConfig {
  return {
    playerPack: calculatorState.playerPack,
    opponentPack: calculatorState.opponentPack,
    playerToy: calculatorState.playerToy,
    playerToyLevel: toNumberOrFallback(calculatorState.playerToyLevel, 1),
    playerHardToy: calculatorState.playerHardToy,
    playerHardToyLevel: calculatorState.playerHardToyLevel,
    opponentToy: calculatorState.opponentToy,
    opponentToyLevel: toNumberOrFallback(calculatorState.opponentToyLevel, 1),
    opponentHardToy: calculatorState.opponentHardToy,
    opponentHardToyLevel: calculatorState.opponentHardToyLevel,
    turn: calculatorState.turn,
    playerGoldSpent: calculatorState.playerGoldSpent,
    opponentGoldSpent: calculatorState.opponentGoldSpent,
    playerRollAmount: calculatorState.playerRollAmount,
    opponentRollAmount: calculatorState.opponentRollAmount,
    playerSummonedAmount: calculatorState.playerSummonedAmount,
    opponentSummonedAmount: calculatorState.opponentSummonedAmount,
    playerLevel3Sold: calculatorState.playerLevel3Sold,
    opponentLevel3Sold: calculatorState.opponentLevel3Sold,
    playerTransformationAmount: calculatorState.playerTransformationAmount,
    opponentTransformationAmount: calculatorState.opponentTransformationAmount,
    playerPets: calculatorState.playerPets,
    opponentPets: calculatorState.opponentPets,
    customPacks: calculatorState.customPacks,
    allPets: calculatorState.allPets,
    oldStork: calculatorState.oldStork,
    tokenPets: calculatorState.tokenPets,
    komodoShuffle: calculatorState.komodoShuffle,
    mana: calculatorState.mana,
    seed: calculatorState.seed,
    simulationCount,
    logsEnabled: false,
    maxLoggedBattles: 0,
  };
}

export function runReplayOddsFromCalculatorState(
  calculatorState: ReplayCalculatorState,
  simulationCount: number,
): SimulationResult {
  const config = createSimulationConfigFromCalculatorState(
    calculatorState,
    simulationCount,
  );
  return runSimulation(config);
}

export function generateReplayCalculatorLink(
  calculatorState: ReplayCalculatorState,
  baseUrl?: string,
): string {
  const parser = new ReplayCalcParser();
  const normalizedBaseUrl = normalizeCalculatorBaseUrl(baseUrl);

  const globalWithWindow = globalThis as typeof globalThis & {
    window?: Window & typeof globalThis;
  };

  const previousWindow = globalWithWindow.window;
  const hadWindow = Object.prototype.hasOwnProperty.call(globalWithWindow, 'window');

  globalWithWindow.window = {
    location: {
      origin: normalizedBaseUrl.origin,
      pathname: normalizedBaseUrl.pathname,
    },
  } as Window & typeof globalThis;

  try {
    const hashLink = parser.generateCalculatorLink(calculatorState);
    return hashLink.replace('#c=', '?c=');
  } finally {
    if (hadWindow) {
      globalWithWindow.window = previousWindow;
    } else {
      delete globalWithWindow.window;
    }
  }
}

export * from '../src/app/integrations/injector.service';
export * from '../src/app/gameplay/simulation-runner';
export * from '../src/app/domain/interfaces/simulation-config.interface';
export * from '../src/app/integrations/log.service';
export * from '../src/app/runtime/state/game.service';
export * from '../src/app/integrations/ability/ability.service';
export * from '../src/app/integrations/pet/pet.service';
export * from '../src/app/integrations/equipment/equipment.service';
export * from '../src/app/integrations/toy/toy.service';
export * from '../src/app/domain/entities/player.class';
export * from '../src/app/integrations/pet/pet-factory.service';
export * from '../src/app/integrations/equipment/equipment-factory.service';
export * from '../src/app/integrations/toy/toy-factory.service';
export * from '../src/app/integrations/replay/replay-calc-parser';



