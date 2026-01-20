
import { SimulationRunner } from '../src/app/engine/simulation-runner';
import { SimulationConfig, SimulationResult } from '../src/app/interfaces/simulation-config.interface';
import { LogService } from '../src/app/services/log.service';
import { GameService } from '../src/app/services/game.service';
import { AbilityService } from '../src/app/services/ability/ability.service';
import { AbilityQueueService } from '../src/app/services/ability/ability-queue.service';
import { AttackEventService } from '../src/app/services/ability/attack-event.service';
import { FaintEventService } from '../src/app/services/ability/faint-event.service';
import { ToyEventService } from '../src/app/services/ability/toy-event.service';
import { PetService } from '../src/app/services/pet/pet.service';
import { EquipmentService } from '../src/app/services/equipment/equipment.service';
import { ToyService } from '../src/app/services/toy/toy.service';
import { PetFactoryService } from '../src/app/services/pet/pet-factory.service';
import { EquipmentFactoryService } from '../src/app/services/equipment/equipment-factory.service';
import { ToyFactoryService } from '../src/app/services/toy/toy-factory.service';
import { InjectorService } from '../src/app/services/injector.service';

class NodeInjector {
    private map = new Map<any, any>();
    register(token: any, instance: any) {
        this.map.set(token, instance);
    }
    get(token: any) {
        return this.map.get(token);
    }
}

export function runSimulation(config: SimulationConfig): SimulationResult {
    const logService = new LogService();
    const gameService = new GameService();
    const abilityQueueService = new AbilityQueueService();
    const toyEventService = new ToyEventService(gameService, logService);
    const attackEventService = new AttackEventService(abilityQueueService);
    const faintEventService = new FaintEventService(abilityQueueService, toyEventService);
    const abilityService = new AbilityService(
        gameService,
        logService,
        toyEventService,
        abilityQueueService,
        attackEventService,
        faintEventService
    );

    // Pet Logic
    const petFactory = new PetFactoryService(logService, abilityService, gameService);
    const petService = new PetService(logService, abilityService, gameService, petFactory);

    // Setup Injector for EquipmentFactory
    const injector = new NodeInjector();
    injector.register(PetService, petService);
    InjectorService.setInjector(injector as any);

    // Equipment Logic
    const equipmentFactory = new EquipmentFactoryService(logService, abilityService, gameService);
    const equipmentService = new EquipmentService(logService, abilityService, gameService, equipmentFactory);

    // Toy Logic
    const toyFactory = new ToyFactoryService(logService, abilityService);
    const toyService = new ToyService(logService, abilityService, gameService, equipmentService, petService, toyFactory);

    // Initialize pet data
    petService.init();

    const runner = new SimulationRunner(
        logService,
        gameService,
        abilityService,
        petService,
        equipmentService,
        toyService
    );

    return runner.run(config);
}

export * from '../src/app/services/injector.service';
export * from '../src/app/engine/simulation-runner';
export * from '../src/app/interfaces/simulation-config.interface';
export * from '../src/app/services/log.service';
export * from '../src/app/services/game.service';
export * from '../src/app/services/ability/ability.service';
export * from '../src/app/services/pet/pet.service';
export * from '../src/app/services/equipment/equipment.service';
export * from '../src/app/services/toy/toy.service';
export * from '../src/app/classes/player.class';
export * from '../src/app/services/pet/pet-factory.service';
export * from '../src/app/services/equipment/equipment-factory.service';
export * from '../src/app/services/toy/toy-factory.service';

