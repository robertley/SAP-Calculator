import { describe, expect, it } from 'vitest';
import {
  expandCompactCalculatorState,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';
import { SimulationRunner } from 'app/gameplay/simulation-runner';
import { LogService } from 'app/integrations/log.service';
import { GameService } from 'app/runtime/state/game.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { AbilityQueueService } from 'app/integrations/ability/ability-queue.service';
import { AttackEventService } from 'app/integrations/ability/attack-event.service';
import { FaintEventService } from 'app/integrations/ability/faint-event.service';
import { ToyEventService } from 'app/integrations/ability/toy-event.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { PetFactoryService } from 'app/integrations/pet/pet-factory.service';
import { EquipmentFactoryService } from 'app/integrations/equipment/equipment-factory.service';
import { ToyFactoryService } from 'app/integrations/toy/toy-factory.service';
import { InjectorService } from 'app/integrations/injector.service';
import { getOptimizedPositioningLineup } from 'app/integrations/replay/replay-positioning-image.service';
import {
  PetConfig,
  SimulationConfig,
} from '../../../src/app/domain/interfaces/simulation-config.interface';
import { runPositioningOptimization } from '../../../src/app/integrations/simulation/positioning-optimizer';

class NodeInjector {
  private map = new Map<unknown, unknown>();

  register(token: unknown, instance: unknown): void {
    const key =
      typeof token === 'function' && 'name' in token
        ? String((token as { name?: unknown }).name ?? '')
        : token;
    this.map.set(key, instance);
  }

  get(token: unknown): unknown {
    const key =
      typeof token === 'function' && 'name' in token
        ? String((token as { name?: unknown }).name ?? '')
        : token;
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
  InjectorService.setInjector(injector as never);
  petService.init();

  return new SimulationRunner(
    logService,
    gameService,
    abilityService,
    petService,
    equipmentService,
    toyService,
  );
}

function clonePet(pet: PetConfig | null): PetConfig | null {
  if (!pet) {
    return null;
  }
  return {
    ...pet,
    equipment: pet.equipment ? { ...pet.equipment } : null,
  };
}

function cloneLineup(lineup: (PetConfig | null)[]): (PetConfig | null)[] {
  return lineup.map((pet) => clonePet(pet));
}

function buildConfig(
  state: SimulationConfig,
  playerPets: (PetConfig | null)[],
  simulationCount: number,
): SimulationConfig {
  return {
    ...state,
    playerPets: cloneLineup(playerPets),
    opponentPets: cloneLineup(state.opponentPets ?? []),
    simulationCount,
    logsEnabled: false,
    maxLoggedBattles: 0,
  };
}

describe('positioning optimizer live-board regression', () => {
  it(
    'returns projected state that must be applied with the optimized order',
    () => {
      const payload =
        'SAPC1:eyJwUCI6IlVuaWNvcm4iLCJwVEwiOiIxIiwib1RMIjoiMSIsInBIVEwiOiIxIiwib0hUTCI6IjEiLCJ0IjoxNSwicEdTIjoyMSwicCI6W3sibiI6IlBpeGl1IiwiYSI6MjgsImgiOjI2LCJlIjo0LCJlcSI6eyJuIjoiR2luZ2VyYnJlYWQgTWFuIn19LHsibiI6IkN5Y2xvcHMiLCJhIjoyOCwiaCI6MjgsImUiOjEsImVxIjp7Im4iOiJHaW5nZXJicmVhZCBNYW4ifX0seyJuIjoiV29ybSBvZiBTYW5kIiwiYSI6MTAsImgiOjcsImUiOjUsIm0iOjF9LHsibiI6IkJhZCBEb2ciLCJhIjoyMywiaCI6MjcsImUiOjUsImVxIjp7Im4iOiJQb3Bjb3JuIn0sIm0iOjJ9LHsibiI6Ik1hbnRpY29yZSIsImEiOjcsImgiOjR9XSwibyI6W3sibiI6IlJvb3N0ZXIiLCJhIjo4LCJoIjo3LCJlIjoyLCJlcSI6eyJuIjoiSG9uZXkifX0seyJuIjoiU2hlZXAiLCJhIjo0LCJoIjo0LCJlIjoyLCJlcSI6eyJuIjoiTXVzaHJvb20ifX0seyJuIjoiRmx5IiwiYSI6NiwiaCI6NiwiZSI6Mn0seyJuIjoiVHVya2V5IiwiYSI6NSwiaCI6NiwiZSI6Mn0seyJuIjoiU2hhcmsiLCJhIjoyLCJoIjoyLCJlcSI6eyJuIjoiTWVsb24ifX1dLCJtIjp0cnVlLCJwUkEiOjksIm9SQSI6MSwib0wzIjoxLCJwU0EiOjEsInNhIjp0cnVlfQ';
      const state = expandCompactCalculatorState(
        parseImportPayload(payload),
      ) as SimulationConfig;
      const optimizerRunner = createSimulationRunner(new LogService());
      const verifierRunner = createSimulationRunner(new LogService());
      const simulationCount = 50;
      const config = buildConfig(state, state.playerPets ?? [], simulationCount);

      const projected = runPositioningOptimization({
        baseConfig: config,
        options: {
          side: 'player',
          maxSimulationsPerPermutation: simulationCount,
          batchSize: Math.min(25, simulationCount),
          minSamplesBeforeElimination: Math.min(50, simulationCount),
          confidenceZ: 1.96,
        },
        projectEndTurnLineup: ({ baseConfig, side, lineup }) =>
          optimizerRunner.projectLineupAfterEndTurn(baseConfig, side, lineup),
        simulateBatch: (batchConfig) => optimizerRunner.run(batchConfig),
      });

      const rawAppliedResult = verifierRunner.run(
        buildConfig(state, projected.bestPermutation.lineup, simulationCount),
      );
      const projectedAppliedResult = verifierRunner.run(
        buildConfig(
          state,
          projected.bestPermutation.simulationLineup,
          simulationCount,
        ),
      );
      const replayImageAppliedResult = verifierRunner.run(
        buildConfig(
          state,
          getOptimizedPositioningLineup(projected),
          simulationCount,
        ),
      );

      expect(rawAppliedResult.playerWins).toBeLessThan(simulationCount);
      expect(projectedAppliedResult.playerWins).toBe(simulationCount);
      expect(replayImageAppliedResult).toEqual(projectedAppliedResult);
    },
    120000,
  );
});
