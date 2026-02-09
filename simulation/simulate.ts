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



