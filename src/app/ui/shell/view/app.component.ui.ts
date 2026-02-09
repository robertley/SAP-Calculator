import { FormArray, FormGroup } from '@angular/forms';


import {
  createAppFormGroup,
  initPetForms as initPetFormsForm,
} from '../state/app.component.forms';



import {
  AppUiContext,
  fixCustomPackSelect,
} from './app.component.ui-common';
import {
  setHardToyImage,
  updateGoldSpent,
  updatePlayerPack,
  updatePlayerToy,
  updatePreviousShopTier,
  updateToyLevel,
} from './app.component.ui-pack-toy';
import {
  importCalculator,
  openCustomPackEditor,
  resetPackImageError,
} from './app.component.ui-workflows';

export {
  fixCustomPackSelect,
  getRollInputVisible,
  makeFormGroup,
  printFormGroup,
  setRandomBackground,
  toggleAdvanced,
  trackByIndex,
  trackByLogTab,
  trackByTeamId,
} from './app.component.ui-common';

export {
  clearPlayerToy,
  getRandomEquipment,
  getRandomToyName,
  getSelectedTeam,
  getSelectedTeamName,
  getSelectedTeamPreviewIcons,
  getToyIcon,
  getToyOptionStyle,
  getValidCustomPacks,
  randomizePlayerPets,
  randomizePlayerToy,
  setHardToyImage,
  setToyImage,
  updateGoldSpent,
  updatePlayerPack,
  updatePlayerToy,
  updatePreviousShopTier,
  updateToyLevel,
} from './app.component.ui-pack-toy';


export function loadStateFromUrl(
  ctx: AppUiContext,
  isInitialLoad: boolean = false,
): boolean {
  const parsedState = ctx.urlStateService.parseCalculatorStateFromUrl();
  if (!parsedState.state) {
    if (parsedState.error) {
      console.error(parsedState.error);
      ctx.setStatus?.(
        'Could not load the shared calculator link. The data may be corrupted.',
        'error',
      );
    }
    return false;
  }

  const success = importCalculator(
    ctx,
    JSON.stringify(parsedState.state),
    isInitialLoad,
  );
  if (success) {
    console.log('Calculator state loaded from URL.');
  }
  return success;
}

export function loadLocalStorage(ctx: AppUiContext): void {
  const storedValue = ctx.localStorageService.getStorage();

  if (storedValue) {
    try {
      const calculator = JSON.parse(storedValue);
      applyCalculatorState(ctx, calculator);
    } catch (error) {
      console.log('error loading local storage', error);
      ctx.localStorageService.clearStorage();
    }
  }
}

export function applyCalculatorState(
  ctx: AppUiContext,
  calculator: any,
): void {
  ctx.calculatorStateService.applyCalculatorState(
    ctx.formGroup,
    calculator,
    ctx.dayNight,
    () => fixCustomPackSelect(ctx),
  );
  ctx.logService.setShowTriggerNamesInLogs(
    ctx.formGroup.get('showTriggerNamesInLogs')?.value,
  );
}

export function setDayNight(ctx: AppUiContext): void {
  const turn = ctx.formGroup.get('turn').value;
  const day = turn % 2 == 1;
  ctx.dayNight = day;
  ctx.gameService.gameApi.day = day;
}

export function initFormGroup(ctx: AppUiContext): void {
  ctx.formGroup = createAppFormGroup({
    player: ctx.player,
    opponent: ctx.opponent,
    gameService: ctx.gameService,
    toyService: ctx.toyService,
    updatePreviousShopTier: (turn) => updatePreviousShopTier(ctx, turn),
    updateGoldSpent: (player, opponent) =>
      updateGoldSpent(ctx, player, opponent),
    setDayNight: () => setDayNight(ctx),
    openCustomPackEditor: () => openCustomPackEditor(ctx),
    resetPackImageError: (side, packName) =>
      resetPackImageError(ctx, side, packName),
    updatePlayerPack: (player, pack, randomize) =>
      updatePlayerPack(ctx, player, pack, randomize),
    updatePlayerToy: (player, toy) => updatePlayerToy(ctx, player, toy),
    updateToyLevel: (player, level) => updateToyLevel(ctx, player, level),
    setHardToyImage: (player, toyName) =>
      setHardToyImage(ctx, player, toyName),
  });
  ctx.logService.setShowTriggerNamesInLogs(
    ctx.formGroup.get('showTriggerNamesInLogs')?.value,
  );
  ctx.formGroup
    .get('showTriggerNamesInLogs')
    ?.valueChanges.subscribe((value: boolean) => {
      ctx.logService.setShowTriggerNamesInLogs(value);
    });
  refreshPetFormArrays(ctx);
}

export function initPetForms(ctx: AppUiContext): void {
  initPetFormsForm(ctx.formGroup, ctx.player, ctx.opponent);
  refreshPetFormArrays(ctx);
}

export function refreshPetFormArrays(ctx: AppUiContext): void {
  ctx.playerPetsControls = Array.from(
    (ctx.formGroup.get('playerPets') as FormArray).controls,
  ).reverse();
  ctx.opponentPetsControls = Array.from(
    (ctx.formGroup.get('opponentPets') as FormArray).controls,
  );
}

export function initApp(ctx: AppUiContext): void {
  ctx.petService.buildCustomPackPets(
    ctx.formGroup.get('customPacks') as FormArray,
  );
  initPlayerPets(ctx);
  updatePlayerPack(ctx, ctx.player, ctx.formGroup.get('playerPack').value, false);
  updatePlayerPack(
    ctx,
    ctx.opponent,
    ctx.formGroup.get('opponentPack').value,
    false,
  );
  updatePlayerToy(ctx, ctx.player, ctx.formGroup.get('playerToy').value);
  updatePlayerToy(ctx, ctx.opponent, ctx.formGroup.get('opponentToy').value);
  ctx.gameService.gameApi.playerHardToy =
    ctx.formGroup.get('playerHardToy').value;
  ctx.gameService.gameApi.playerHardToyLevel =
    ctx.formGroup.get('playerHardToyLevel').value;
  ctx.gameService.gameApi.opponentHardToy =
    ctx.formGroup.get('opponentHardToy').value;
  ctx.gameService.gameApi.opponentHardToyLevel = ctx.formGroup.get(
    'opponentHardToyLevel',
  ).value;
  setHardToyImage(ctx, ctx.player, ctx.formGroup.get('playerHardToy').value);
  setHardToyImage(ctx, ctx.opponent, ctx.formGroup.get('opponentHardToy').value);
  ctx.previousPackOpponent = ctx.opponent.pack;
  ctx.previousPackPlayer = ctx.player.pack;
}

export function initGameApi(ctx: AppUiContext): void {
  ctx.gameService.gameApi.day = ctx.dayNight;
  ctx.gameService.gameApi.oldStork = ctx.formGroup.get('oldStork').value;
  ctx.gameService.gameApi.komodoShuffle =
    ctx.formGroup.get('komodoShuffle').value;
  ctx.gameService.gameApi.mana = ctx.formGroup.get('mana').value;
  ctx.gameService.gameApi.playerRollAmount =
    ctx.formGroup.get('playerRollAmount').value;
  ctx.gameService.gameApi.opponentRollAmount =
    ctx.formGroup.get('opponentRollAmount').value;
  ctx.gameService.gameApi.playerLevel3Sold =
    ctx.formGroup.get('playerLevel3Sold').value;
  ctx.gameService.gameApi.opponentLevel3Sold =
    ctx.formGroup.get('opponentLevel3Sold').value;
  ctx.gameService.gameApi.playerSummonedAmount = ctx.formGroup.get(
    'playerSummonedAmount',
  ).value;
  ctx.gameService.gameApi.opponentSummonedAmount = ctx.formGroup.get(
    'opponentSummonedAmount',
  ).value;
  ctx.gameService.gameApi.playerTransformationAmount = ctx.formGroup.get(
    'playerTransformationAmount',
  ).value;
  ctx.gameService.gameApi.opponentTransformationAmount = ctx.formGroup.get(
    'opponentTransformationAmount',
  ).value;
}

export function initPlayerPets(ctx: AppUiContext): void {
  for (let i = 0; i < 5; i++) {
    const petForm = (ctx.formGroup.get('playerPets') as FormArray).controls[
      i
    ] as FormGroup;
    if (petForm.get('name').value == null) {
      continue;
    }
    const pet = ctx.petService.createPet(petForm.value, ctx.player);
    ctx.player.setPet(i, pet, true);
  }
  for (let i = 0; i < 5; i++) {
    const petForm = (ctx.formGroup.get('opponentPets') as FormArray).controls[
      i
    ] as FormGroup;
    if (petForm.get('name').value == null) {
      continue;
    }
    const pet = ctx.petService.createPet(petForm.value, ctx.opponent);
    ctx.opponent.setPet(i, pet, true);
  }
}


export {
  clearCache,
  decrementToyLevel,
  drop,
  exportCalculator,
  generateShareLink,
  getPackIcon,
  getToyIconPathValue,
  importCalculator,
  incrementToyLevel,
  initModals,
  onPackImageError,
  onItemSelected,
  openCustomPackEditor,
  openSelectionDialog,
  randomize,
  removeHardToy,
  resetPackImageError,
  resetPlayer,
  undoRandomize,
} from './app.component.ui-workflows';
