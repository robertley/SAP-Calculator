import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { createPack } from 'app/runtime/custom-pack-form';
import { GameService } from './game.service';

type CalculatorStateInput = Record<string, unknown> | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class CalculatorStateService {
  constructor(private gameService: GameService) {}

  applyCalculatorState(
    formGroup: FormGroup,
    calculator: CalculatorStateInput,
    dayNight: boolean,
    fixCustomPackSelect?: () => void,
  ): void {
    const defaultState = this.getDefaultState();
    const calculatorState = this.asRecord(calculator);
    const finalState = { ...defaultState, ...calculatorState };

    formGroup.patchValue(finalState, { emitEvent: false });

    const customPacks = calculatorState?.customPacks;
    const patchState = calculatorState
      ? { ...calculatorState, customPacks: [] }
      : {};
    this.loadCustomPacks(formGroup, customPacks);
    formGroup.patchValue(patchState, { emitEvent: false });
    formGroup.get('tokenPets')?.setValue(true, { emitEvent: false });
    this.normalizeEquipmentControls(
      formGroup.get('playerPets') as FormArray,
    );
    this.normalizeEquipmentControls(
      formGroup.get('opponentPets') as FormArray,
    );

    if (fixCustomPackSelect) {
      setTimeout(() => fixCustomPackSelect());
    }

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
    this.gameService.gameApi.day = dayNight;
    this.gameService.gameApi.turnNumber = formGroup.get('turn').value;
  }

  loadCustomPacks(formGroup: FormGroup, customPacks: unknown): void {
    const formArray = formGroup.get('customPacks') as FormArray;
    formArray.clear();
    const packs = Array.isArray(customPacks) ? customPacks : [];
    for (const customPack of packs) {
      const packFormGroup = createPack(customPack);
      formArray.push(packFormGroup);
    }
  }

  private getDefaultState(): Record<string, unknown> {
    return {
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      playerToy: null,
      playerToyLevel: '1',
      playerHardToy: null,
      playerHardToyLevel: '1',
      opponentToy: null,
      opponentToyLevel: '1',
      opponentHardToy: null,
      opponentHardToyLevel: '1',
      turn: 11,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      playerRollAmount: 4,
      opponentRollAmount: 4,
      playerSummonedAmount: 0,
      opponentSummonedAmount: 0,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 0,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
      playerPets: Array(5).fill(null),
      opponentPets: Array(5).fill(null),
      allPets: false,
      logFilter: null,
      customPacks: [],
      oldStork: false,
      tokenPets: true,
      komodoShuffle: false,
      mana: false,
      seed: null,
      showAdvanced: false,
      showTriggerNamesInLogs: false,
      showSwallowedLevels: false,
      ailmentEquipment: false,
    };
  }

  private normalizeEquipmentControls(formArray: FormArray | null): void {
    if (!formArray?.controls?.length) {
      return;
    }
    for (const control of formArray.controls) {
      const group = control as FormGroup;
      const equipmentControl = group.get('equipment');
      if (!equipmentControl) {
        continue;
      }
      const value = equipmentControl.value;
      const equipmentName = this.getEquipmentName(value);
      if (equipmentName !== value) {
        equipmentControl.setValue(equipmentName, { emitEvent: false });
      }
    }
  }

  private getEquipmentName(value: unknown): string | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (
      value !== null &&
      typeof value === 'object' &&
      'name' in value &&
      typeof value.name === 'string'
    ) {
      return value.name;
    }
    return null;
  }

  private asRecord(value: CalculatorStateInput): Record<string, unknown> | null {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }
    return null;
  }
}




