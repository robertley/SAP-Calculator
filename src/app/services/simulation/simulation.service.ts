import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimulationRunner } from '../../engine/simulation-runner';
import {
  SimulationConfig,
  SimulationResult,
} from '../../interfaces/simulation-config.interface';
import { AbilityService } from '../ability/ability.service';
import { EquipmentService } from '../equipment/equipment.service';
import { GameService } from '../game.service';
import { LogService } from '../log.service';
import { PetService } from '../pet/pet.service';
import { ToyService } from '../toy/toy.service';
import { Player } from '../../classes/player.class';
import { MAX_LOGGED_BATTLES } from './simulation.constants';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  constructor(
    private logService: LogService,
    private gameService: GameService,
    private abilityService: AbilityService,
    private petService: PetService,
    private equipmentService: EquipmentService,
    private toyService: ToyService,
  ) {}

  runSimulationInWorker(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
    callbacks: {
      onProgress?: (progress: {
        completed: number;
        total: number;
        playerWins: number;
        opponentWins: number;
        draws: number;
        loggedBattles: number;
      }) => void;
      onResult?: (result: SimulationResult) => void;
      onAborted?: (result: SimulationResult) => void;
      onError?: (message: string) => void;
    },
    options?: { progressInterval?: number },
  ): Worker | null {
    if (typeof Worker === 'undefined') {
      const result = this.runSimulation(formGroup, count, player, opponent);
      callbacks.onResult?.(result);
      return null;
    }

    const config = this.buildConfig(formGroup, count);
    const showTriggerNamesInLogs =
      formGroup.get('showTriggerNamesInLogs')?.value ?? false;
    const progressInterval = options?.progressInterval ?? 50;

    const worker = new Worker(
      new URL('./simulation.worker', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = ({ data }) => {
      if (!data || !data.type) {
        return;
      }
      if (data.type === 'progress') {
        callbacks.onProgress?.(data);
      } else if (data.type === 'result') {
        callbacks.onResult?.(data.result as SimulationResult);
      } else if (data.type === 'aborted') {
        callbacks.onAborted?.(data.result as SimulationResult);
      } else if (data.type === 'error') {
        callbacks.onError?.(data.message || 'Worker simulation failed.');
      }
    };

    worker.onerror = (event) => {
      callbacks.onError?.(event.message || 'Worker simulation failed.');
    };

    worker.postMessage({
      type: 'start',
      config,
      progressInterval,
      showTriggerNamesInLogs,
    });

    return worker;
  }

  requestWorkerCancel(worker: Worker | null): void {
    if (!worker) {
      return;
    }
    try {
      worker.postMessage({ type: 'cancel' });
    } catch (error) {
      // ignore
    }
  }

  runSimulation(
    formGroup: FormGroup,
    count: number,
    player: Player,
    opponent: Player,
  ): SimulationResult {
    const config = this.buildConfig(formGroup, count);
    const wasLoggingEnabled = this.logService.isEnabled();
    const wasDeferDecorations = this.logService.isDeferDecorations();
    this.logService.setEnabled(config.logsEnabled !== false);
    this.logService.setDeferDecorations(true);

    const runner = new SimulationRunner(
      this.logService,
      this.gameService,
      this.abilityService,
      this.petService,
      this.equipmentService,
      this.toyService,
    );

    const result = runner.run(config);

    // Restore GameService to UI players
    this.gameService.init(player, opponent);
    this.syncGameApiFromForm(formGroup);
    this.logService.setEnabled(wasLoggingEnabled);
    this.logService.setDeferDecorations(wasDeferDecorations);

    return result;
  }

  private syncGameApiFromForm(formGroup: FormGroup) {
    this.gameService.gameApi.oldStork = formGroup.get('oldStork').value;
    this.gameService.gameApi.komodoShuffle =
      formGroup.get('komodoShuffle').value;
    this.gameService.gameApi.mana = formGroup.get('mana').value;
    this.gameService.gameApi.playerRollAmount =
      formGroup.get('playerRollAmount').value;
    this.gameService.gameApi.opponentRollAmount =
      formGroup.get('opponentRollAmount').value;
    this.gameService.gameApi.playerLevel3Sold =
      formGroup.get('playerLevel3Sold').value;
    this.gameService.gameApi.opponentLevel3Sold =
      formGroup.get('opponentLevel3Sold').value;
    this.gameService.gameApi.playerSummonedAmount = formGroup.get(
      'playerSummonedAmount',
    ).value;
    this.gameService.gameApi.opponentSummonedAmount = formGroup.get(
      'opponentSummonedAmount',
    ).value;
    this.gameService.gameApi.playerTransformationAmount = formGroup.get(
      'playerTransformationAmount',
    ).value;
    this.gameService.gameApi.opponentTransformationAmount = formGroup.get(
      'opponentTransformationAmount',
    ).value;
    this.gameService.setGoldSpent(
      formGroup.get('playerGoldSpent').value,
      formGroup.get('opponentGoldSpent').value,
    );
    this.gameService.setTurnNumber(formGroup.get('turn').value);
  }

  private buildConfig(formGroup: FormGroup, count: number): SimulationConfig {
    const logsEnabled = formGroup.get('logsEnabled')?.value ?? true;
    const rawSeed = formGroup.get('seed')?.value;
    const parsedSeed = Number(rawSeed);
    const seed =
      rawSeed === '' || rawSeed == null || !Number.isFinite(parsedSeed)
        ? null
        : Math.trunc(parsedSeed);
    return {
      playerPack: formGroup.get('playerPack').value,
      opponentPack: formGroup.get('opponentPack').value,
      playerToy: formGroup.get('playerToy').value,
      playerToyLevel: formGroup.get('playerToyLevel').value,
      playerHardToy: formGroup.get('playerHardToy').value,
      playerHardToyLevel: formGroup.get('playerHardToyLevel').value,
      opponentToy: formGroup.get('opponentToy').value,
      opponentToyLevel: formGroup.get('opponentToyLevel').value,
      opponentHardToy: formGroup.get('opponentHardToy').value,
      opponentHardToyLevel: formGroup.get('opponentHardToyLevel').value,
      turn: formGroup.get('turn').value,
      playerGoldSpent: formGroup.get('playerGoldSpent').value,
      opponentGoldSpent: formGroup.get('opponentGoldSpent').value,
      playerRollAmount: formGroup.get('playerRollAmount').value,
      opponentRollAmount: formGroup.get('opponentRollAmount').value,
      playerSummonedAmount: formGroup.get('playerSummonedAmount').value,
      opponentSummonedAmount: formGroup.get('opponentSummonedAmount').value,
      playerLevel3Sold: formGroup.get('playerLevel3Sold').value,
      opponentLevel3Sold: formGroup.get('opponentLevel3Sold').value,
      playerTransformationAmount: formGroup.get('playerTransformationAmount')
        .value,
      opponentTransformationAmount: formGroup.get(
        'opponentTransformationAmount',
      ).value,
      playerPets: this.normalizePetConfigs(formGroup.get('playerPets').value),
      opponentPets: this.normalizePetConfigs(formGroup.get('opponentPets').value),
      allPets: formGroup.get('allPets').value,
      oldStork: formGroup.get('oldStork').value,
      tokenPets: formGroup.get('tokenPets').value,
      komodoShuffle: formGroup.get('komodoShuffle').value,
      mana: formGroup.get('mana').value,
      seed,
      simulationCount: count,
      logsEnabled,
      maxLoggedBattles: MAX_LOGGED_BATTLES,
    };
  }

  private normalizePetConfigs(pets: any[]): (SimulationConfig['playerPets'][number] | null)[] {
    if (!Array.isArray(pets)) {
      return [];
    }
    return pets.map((pet) => this.normalizePetConfig(pet));
  }

  private normalizePetConfig(
    pet: any,
  ): SimulationConfig['playerPets'][number] | null {
    if (!pet || !pet.name) {
      return null;
    }

    const normalized = { ...pet };
    const rawEquipment = normalized.equipment;
    let equipmentName: string | null = null;
    let equipmentUses: number | null = normalized.equipmentUses ?? null;

    if (rawEquipment && typeof rawEquipment === 'object') {
      equipmentName = rawEquipment.name ?? null;
      if (equipmentUses == null && rawEquipment.uses != null) {
        const usesValue = Number(rawEquipment.uses);
        equipmentUses = Number.isFinite(usesValue) ? usesValue : null;
      }
    } else if (typeof rawEquipment === 'string') {
      equipmentName = rawEquipment;
    }

    normalized.equipment = equipmentName ? { name: equipmentName } : null;
    normalized.equipmentUses = equipmentUses ?? null;

    delete normalized.parent;
    delete normalized.logService;
    delete normalized.abilityService;
    delete normalized.gameService;
    delete normalized.petService;
    delete normalized.abilityList;
    delete normalized.originalAbilityList;
    delete normalized.originalEquipment;

    return normalized;
  }
}
