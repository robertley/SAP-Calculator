/// <reference lib="webworker" />

import { SimulationRunner } from '../../engine/simulation-runner';
import { SimulationConfig } from '../../interfaces/simulation-config.interface';
import { LogService } from '../log.service';
import { GameService } from '../game.service';
import { AbilityService } from '../ability/ability.service';
import { PetService } from '../pet/pet.service';
import { EquipmentService } from '../equipment/equipment.service';
import { ToyService } from '../toy/toy.service';
import { EquipmentFactoryService } from '../equipment/equipment-factory.service';
import { ToyFactoryService } from '../toy/toy-factory.service';
import { PetFactoryService } from '../pet/pet-factory.service';
import { AbilityQueueService } from '../ability/ability-queue.service';
import { ToyEventService } from '../ability/toy-event.service';
import { AttackEventService } from '../ability/attack-event.service';
import { FaintEventService } from '../ability/faint-event.service';
import { InjectorService } from '../injector.service';

type StartMessage = {
  type: 'start';
  config: SimulationConfig;
  progressInterval?: number;
  showTriggerNamesInLogs?: boolean;
};

type CancelMessage = { type: 'cancel' };

type IncomingMessage = StartMessage | CancelMessage;

let cancelRequested = false;

const sanitizeResult = (result: any) => {
  if (!result || !Array.isArray(result.battles)) {
    return result;
  }

  const sanitizedBattles = result.battles.map((battle: any) => {
    const logs = Array.isArray(battle?.logs)
      ? battle.logs.map((log: any) => ({
          message: log?.message ?? '',
          rawMessage: log?.rawMessage,
          type: log?.type,
          randomEvent: log?.randomEvent,
          tiger: log?.tiger,
          puma: log?.puma,
          pteranodon: log?.pteranodon,
          pantherMultiplier: log?.pantherMultiplier,
          count: log?.count,
          bold: log?.bold,
          decorated: log?.decorated,
          sourceIndex: log?.sourceIndex,
          targetIndex: log?.targetIndex,
          playerIsOpponent: log?.player?.isOpponent ?? log?.playerIsOpponent,
        }))
      : [];

    return {
      winner: battle?.winner ?? 'draw',
      logs,
    };
  });

  return {
    playerWins: result.playerWins ?? 0,
    opponentWins: result.opponentWins ?? 0,
    draws: result.draws ?? 0,
    battles: sanitizedBattles,
  };
};

const createRunner = () => {
  const logService = new LogService();
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
  const toyFactory = new ToyFactoryService(logService, abilityService);
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
  const toyService = new ToyService(
    logService,
    abilityService,
    gameService,
    equipmentService,
    petService,
    toyFactory,
  );

  const injectorShim = {
    get: (token: any) => {
      if (token === PetService) return petService;
      if (token === EquipmentService) return equipmentService;
      if (token === ToyService) return toyService;
      if (token === GameService) return gameService;
      if (token === AbilityService) return abilityService;
      return null;
    },
  };
  InjectorService.setInjector(injectorShim as any);

  petService.init();

  return {
    runner: new SimulationRunner(
      logService,
      gameService,
      abilityService,
      petService,
      equipmentService,
      toyService,
    ),
    logService,
  };
};

addEventListener('message', ({ data }: MessageEvent<IncomingMessage>) => {
  if (!data) {
    return;
  }

  if (data.type === 'cancel') {
    cancelRequested = true;
    return;
  }

  if (data.type !== 'start') {
    return;
  }

  cancelRequested = false;
  const { config, progressInterval, showTriggerNamesInLogs } = data;

  try {
    const { runner, logService } = createRunner();
    logService.setShowTriggerNamesInLogs(Boolean(showTriggerNamesInLogs));

    const result = runner.run(config, {
      progressInterval: progressInterval ?? 50,
      shouldAbort: () => cancelRequested,
      onProgress: (progress) => {
        postMessage({ type: 'progress', ...progress });
      },
    });

    if (cancelRequested) {
      postMessage({ type: 'aborted', result: sanitizeResult(result) });
    } else {
      postMessage({ type: 'result', result: sanitizeResult(result) });
    }
  } catch (error) {
    postMessage({
      type: 'error',
      message:
        error instanceof Error ? error.message : 'Worker simulation failed.',
    });
  }
});
