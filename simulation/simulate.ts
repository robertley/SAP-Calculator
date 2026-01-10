
import { SimulationRunner } from 'app/engine/simulation-runner';
import { SimulationConfig, SimulationResult } from 'app/interfaces/simulation-config.interface';
import { LogService } from 'app/services/log.service';
import { GameService } from 'app/services/game.service';
import { AbilityService } from 'app/services/ability.service';
import { PetService } from 'app/services/pet.service';
import { EquipmentService } from 'app/services/equipment.service';
import { ToyService } from 'app/services/toy.service';
import { PetFactoryService } from 'app/services/pet-factory.service';
import { EquipmentFactoryService } from 'app/services/equipment-factory.service';
import { ToyFactoryService } from 'app/services/toy-factory.service';
import { InjectorService } from 'app/services/injector.service';

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
    const abilityService = new AbilityService(gameService);

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
