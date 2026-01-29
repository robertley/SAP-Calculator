import { ElementRef, QueryList } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Modal } from 'bootstrap';
import { Player } from '../classes/player.class';
import { TeamPreset } from '../services/team-presets.service';
import { LocalStorageService } from '../services/local-storage.service';
import { UrlStateService } from '../services/url-state.service';
import { CalculatorStateService } from '../services/calculator-state.service';
import { PetService } from '../services/pet/pet.service';
import { EquipmentService } from '../services/equipment/equipment.service';
import { GameService } from '../services/game.service';
import { ToyService } from '../services/toy/toy.service';
import { PetSelectorComponent } from '../components/pet-selector/pet-selector.component';
import { SelectionType } from '../components/item-selection-dialog/item-selection-dialog.component';
import {
  getPackIconPath,
  getPetIconPath,
  getToyIconPath,
} from '../util/asset-utils';
import { shouldShowRollInputs } from './app.component.roll-utils';
import { BATTLE_BACKGROUND_BASE, TOY_ART_BASE } from './app.constants';
import {
  createAppFormGroup,
  initPetForms as initPetFormsForm,
} from './app.component.form-utils';
import {
  buildExportPayload,
  buildShareableLink,
} from './app.component.share-utils';

export interface AppUiContext {
  formGroup: FormGroup;
  player: Player;
  opponent: Player;
  petSelectors: QueryList<PetSelectorComponent>;
  selectionType: SelectionType;
  selectionSide: 'player' | 'opponent' | 'none';
  showSelectionDialog: boolean;
  selectedTeamId: string;
  savedTeams: TeamPreset[];
  playerPackImageBroken: boolean;
  opponentPackImageBroken: boolean;
  previousPackPlayer: string | null;
  previousPackOpponent: string | null;
  customPackEditor: ElementRef;
  customPackEditorModal: Modal;
  localStorageService: LocalStorageService;
  urlStateService: UrlStateService;
  calculatorStateService: CalculatorStateService;
  petService: PetService;
  equipmentService: EquipmentService;
  gameService: GameService;
  toyService: ToyService;
  battleBackgroundUrl: string;
  battleBackgrounds: string[];
  dayNight: boolean;
  playerToyImageUrl: string;
  opponentToyImageUrl: string;
  playerHardToyImageUrl: string;
  opponentHardToyImageUrl: string;
  playerPetsControls: AbstractControl[];
  opponentPetsControls: AbstractControl[];
  undoState?: any;
  setStatus?: (message: string, tone?: 'success' | 'error') => void;
}

export function trackByIndex(index: number): number {
  return index;
}

export function trackByTeamId(index: number, team: TeamPreset): string {
  return team?.id ?? String(index);
}

export function trackByLogTab(index: number, tab: { value: string | null }) {
  return tab?.value ?? String(index);
}

export function getRollInputVisible(ctx: AppUiContext): boolean {
  return (
    ctx.formGroup.get('showAdvanced').value ||
    shouldShowRollInputs([ctx.player, ctx.opponent])
  );
}

export function printFormGroup(ctx: AppUiContext): void {
  console.log(ctx.formGroup);
}

export function setRandomBackground(ctx: AppUiContext): void {
  if (!ctx.battleBackgrounds.length) {
    ctx.battleBackgroundUrl = '';
    return;
  }
  const idx = Math.floor(Math.random() * ctx.battleBackgrounds.length);
  ctx.battleBackgroundUrl = `${BATTLE_BACKGROUND_BASE}${ctx.battleBackgrounds[idx]}`;
}

export function fixCustomPackSelect(ctx: AppUiContext): void {
  ctx.formGroup
    .get('playerPack')
    .setValue(ctx.formGroup.get('playerPack').value, { emitEvent: false });
  ctx.formGroup
    .get('opponentPack')
    .setValue(ctx.formGroup.get('opponentPack').value, { emitEvent: false });
}

export function makeFormGroup(control: AbstractControl): FormGroup {
  return control as FormGroup;
}

export function toggleAdvanced(ctx: AppUiContext): void {
  const advanced = ctx.formGroup.get('showAdvanced').value;
  ctx.formGroup.get('showAdvanced').setValue(!advanced);
}

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

export function randomizePlayerPets(ctx: AppUiContext, player: Player): void {
  for (let i = 0; i < 5; i++) {
    const pet = ctx.petService.getRandomPet(player);
    pet.equipment = getRandomEquipment(ctx);
    player.setPet(i, pet, true);
  }
}

export function updatePlayerPack(
  ctx: AppUiContext,
  player: Player,
  pack: string,
  randomize: boolean = true,
): void {
  player.pack = pack as Player['pack'];
  let petPool;
  switch (pack) {
    case 'Turtle':
      petPool = ctx.petService.turtlePackPets;
      break;
    case 'Puppy':
      petPool = ctx.petService.puppyPackPets;
      break;
    case 'Star':
      petPool = ctx.petService.starPackPets;
      break;
    case 'Golden':
      petPool = ctx.petService.goldenPackPets;
      break;
    case 'Unicorn':
      petPool = ctx.petService.unicornPackPets;
      break;
    case 'Danger':
      petPool = ctx.petService.dangerPackPets;
      break;
    default:
      petPool = ctx.petService.playerCustomPackPets.get(pack);
      if (!petPool) {
        ctx.formGroup.get('allPets').setValue(true, { emitEvent: false });
        petPool = ctx.petService.allPets;
      }
      break;
  }
  if (player == ctx.player) {
    ctx.gameService.setTierGroupPets(petPool, null);
  } else {
    ctx.gameService.setTierGroupPets(null, petPool);
  }
  if (ctx.formGroup.get('allPets').value) {
    return;
  }
  if (randomize) {
    // this.randomize(player);
  }
}

export function updatePlayerToy(
  ctx: AppUiContext,
  player: Player,
  toy: string,
): void {
  let levelControlName;
  if (player == ctx.player) {
    levelControlName = 'playerToyLevel';
  }
  if (player == ctx.opponent) {
    levelControlName = 'opponentToyLevel';
  }
  const level = Number(ctx.formGroup.get(levelControlName).value);
  player.toy = ctx.toyService.createToy(toy, player, level);
  player.originalToy = player.toy;
  setToyImage(ctx, player, toy);
}

export function setToyImage(
  ctx: AppUiContext,
  player: Player,
  toyName: string | null,
): void {
  const nameId = ctx.toyService.getToyNameId(toyName);
  const imageUrl = nameId ? `${TOY_ART_BASE}${nameId}.png` : '';
  if (player == ctx.player) {
    ctx.playerToyImageUrl = imageUrl;
  } else if (player == ctx.opponent) {
    ctx.opponentToyImageUrl = imageUrl;
  }
}

export function setHardToyImage(
  ctx: AppUiContext,
  player: Player,
  toyName: string | null,
): void {
  const nameId = ctx.toyService.getToyNameId(toyName);
  const imageUrl = nameId ? `${TOY_ART_BASE}${nameId}.png` : '';
  if (player == ctx.player) {
    ctx.playerHardToyImageUrl = imageUrl;
  } else if (player == ctx.opponent) {
    ctx.opponentHardToyImageUrl = imageUrl;
  }
}

export function updatePreviousShopTier(ctx: AppUiContext, turn: number): void {
  let tier = 1;
  if (turn > 2) {
    tier = 2;
  }
  if (turn > 4) {
    tier = 3;
  }
  if (turn > 6) {
    tier = 4;
  }
  if (turn > 8) {
    tier = 5;
  }
  if (turn > 10) {
    tier = 6;
  }
  ctx.gameService.setPreviousShopTier(tier);
  ctx.gameService.setTurnNumber(turn);
}

export function updateGoldSpent(
  ctx: AppUiContext,
  player: number | null,
  opponent: number | null,
): void {
  ctx.gameService.setGoldSpent(player, opponent);
}

export function updateToyLevel(
  ctx: AppUiContext,
  player: Player,
  level: number,
): void {
  if (player.toy) {
    player.toy.level = level;
  }
}

export function getRandomEquipment(ctx: AppUiContext) {
  const equipment = Array.from(
    ctx.equipmentService.getInstanceOfAllEquipment().values(),
  ).filter((equip) => equip?.name !== 'Corncob');
  const allowAilments = ctx.formGroup?.get('ailmentEquipment')?.value;
  const ailments = allowAilments
    ? Array.from(ctx.equipmentService.getInstanceOfAllAilments().values())
    : [];
  const options = equipment.concat(ailments);
  if (options.length === 0) {
    return null;
  }
  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
}

export function getValidCustomPacks(ctx: AppUiContext) {
  const formArray = ctx.formGroup.get('customPacks') as FormArray;
  const validFormGroups = [];
  for (const formGroup of formArray.controls) {
    if (formGroup.valid) {
      validFormGroups.push(formGroup);
    }
  }
  return validFormGroups;
}

export function getToyIcon(toy: string): string {
  return getToyIconPath(toy) ?? '';
}

export function getSelectedTeam(ctx: AppUiContext) {
  return ctx.savedTeams.find((team) => team.id === ctx.selectedTeamId);
}

export function getSelectedTeamName(ctx: AppUiContext): string {
  return getSelectedTeam(ctx)?.name || 'Saved teams';
}

export function getSelectedTeamPreviewIcons(ctx: AppUiContext): string[] {
  const pets = getSelectedTeam(ctx)?.pets || [];
  return pets
    .slice(0, 5)
    .map((pet) => getPetIconPath(pet?.name))
    .filter(Boolean);
}

export function getToyOptionStyle(toy: string | null) {
  if (!toy) {
    return {};
  }
  const icon = getToyIconPath(toy);
  return {
    'background-image': `url(${icon})`,
    'background-repeat': 'no-repeat',
    'background-size': '20px 20px',
    'background-position': 'left center',
    'padding-left': '2rem',
  };
}

export function openSelectionDialog(
  ctx: AppUiContext,
  type: SelectionType,
  side: 'player' | 'opponent' | 'none',
): void {
  ctx.selectionType = type;
  ctx.selectionSide = side;
  ctx.showSelectionDialog = true;
}

export function onItemSelected(ctx: AppUiContext, item: any): void {
  if (item instanceof Event) {
    ctx.showSelectionDialog = false;
    ctx.selectionSide = 'none';
    return;
  }
  if (!ctx.selectionSide || ctx.selectionSide === 'none') {
    if (ctx.selectionType === 'team') {
      ctx.selectedTeamId =
        typeof item === 'string' ? item : item?.id || item?.name || '';
    }
    ctx.showSelectionDialog = false;
    ctx.selectionSide = 'none';
    return;
  }

  const side = ctx.selectionSide;
  const type = ctx.selectionType;

  if (type === 'pack') {
    const packName = item?.name || item;
    if (side === 'player') {
      ctx.formGroup.get('playerPack').setValue(packName);
    } else {
      ctx.formGroup.get('opponentPack').setValue(packName);
    }
  } else if (type === 'toy') {
    const toyName = item?.name || item || null;
    if (side === 'player') {
      ctx.formGroup.get('playerToy').setValue(toyName);
    } else {
      ctx.formGroup.get('opponentToy').setValue(toyName);
    }
  } else if (type === 'hard-toy') {
    const toyName = item?.name || item || null;
    if (side === 'player') {
      ctx.formGroup.get('playerHardToy').setValue(toyName);
    } else {
      ctx.formGroup.get('opponentHardToy').setValue(toyName);
    }
  } else if (type === 'team') {
    ctx.selectedTeamId =
      typeof item === 'string' ? item : item?.id || item?.name || '';
  }

  ctx.showSelectionDialog = false;
  ctx.selectionSide = 'none';
}

export function getPackIcon(packName?: string): string | null {
  return getPackIconPath(packName);
}

export function onPackImageError(
  ctx: AppUiContext,
  side: 'player' | 'opponent',
): void {
  if (side === 'player') {
    ctx.playerPackImageBroken = true;
  } else {
    ctx.opponentPackImageBroken = true;
  }
}

export function resetPackImageError(
  ctx: AppUiContext,
  side: 'player' | 'opponent',
  packName?: string,
): void {
  if (side === 'player') {
    ctx.playerPackImageBroken = false;
  } else {
    ctx.opponentPackImageBroken = false;
  }
}

export function incrementToyLevel(
  ctx: AppUiContext,
  side: 'player' | 'opponent',
): void {
  const controlName =
    side === 'player' ? 'playerToyLevel' : 'opponentToyLevel';
  const currentLevel = ctx.formGroup.get(controlName).value;
  if (currentLevel < 3) {
    ctx.formGroup.get(controlName).setValue(currentLevel + 1);
  }
}

export function decrementToyLevel(
  ctx: AppUiContext,
  side: 'player' | 'opponent',
): void {
  const controlName =
    side === 'player' ? 'playerToyLevel' : 'opponentToyLevel';
  const currentLevel = ctx.formGroup.get(controlName).value;
  if (currentLevel > 1) {
    ctx.formGroup.get(controlName).setValue(currentLevel - 1);
  }
}

export function removeHardToy(
  ctx: AppUiContext,
  side: 'player' | 'opponent',
): void {
  const controlName = side === 'player' ? 'playerHardToy' : 'opponentHardToy';
  ctx.formGroup.get(controlName).setValue(null);
}

export function getToyIconPathValue(toyName?: string): string | null {
  return getToyIconPath(toyName);
}

export function randomize(ctx: AppUiContext, player?: Player): void {
  // Check if we need to snapshot for undo. 
  // We snapshot if we are about to change state.
  // Using JSON strinigify/parse for deep copy of the form value.
  try {
    ctx.undoState = JSON.parse(JSON.stringify(ctx.formGroup.getRawValue()));
  } catch (e) {
    console.error('Failed to create undo snapshot', e);
  }

  if (player) {
    player.allPets = ctx.formGroup.get('allPets').value;
    player.tokenPets = ctx.formGroup.get('tokenPets').value;
    randomizePlayerPets(ctx, player);
  } else {
    ctx.player.allPets = ctx.formGroup.get('allPets').value;
    ctx.player.tokenPets = ctx.formGroup.get('tokenPets').value;
    ctx.opponent.allPets = ctx.formGroup.get('allPets').value;
    ctx.opponent.tokenPets = ctx.formGroup.get('tokenPets').value;
    randomizePlayerPets(ctx, ctx.player);
    randomizePlayerPets(ctx, ctx.opponent);
  }
  if (ctx.formGroup) {
    initPetForms(ctx);
  }
  setTimeout(() => {
    ctx.petSelectors.forEach((selector) => {
      selector.initSelector();
    });
  });
}

export function undoRandomize(ctx: AppUiContext): void {
  if (!ctx.undoState) {
    return;
  }

  // Restore state
  applyCalculatorState(ctx, ctx.undoState);

  // Re-init logic similar to importCalculator/initApp
  // We need to ensure models are updated from the restored form state
  initApp(ctx);

  // Clear undo state after undoing (single level undo)
  ctx.undoState = null;

  setTimeout(() => {
    if (ctx.petSelectors) {
      ctx.petSelectors.forEach((selector) => {
        selector.fixLoadEquipment();
      });
    }
  });
}

export function clearCache(ctx: AppUiContext): void {
  ctx.localStorageService.clearStorage();
  ctx.setStatus?.('Cache cleared. Refresh page to see changes.', 'success');
}

export function initModals(ctx: AppUiContext): void {
  ctx.customPackEditorModal = new Modal(ctx.customPackEditor.nativeElement);
  ctx.customPackEditor.nativeElement.addEventListener(
    'hidden.bs.modal',
    () => {
      // placeholder for modal close logic
    },
  );
}

export function openCustomPackEditor(ctx: AppUiContext): void {
  ctx.customPackEditorModal.show();
  ctx.formGroup
    .get('playerPack')
    .setValue(ctx.previousPackPlayer, { emitEvent: false });
  ctx.formGroup
    .get('opponentPack')
    .setValue(ctx.previousPackOpponent, { emitEvent: false });
}

export function drop(
  ctx: AppUiContext,
  event: CdkDragDrop<string[]>,
  playerString: string,
): void {
  let previousIndex = event.previousIndex;
  let currentIndex = event.currentIndex;
  if (playerString == 'player') {
    previousIndex = 4 - previousIndex;
    currentIndex = 4 - currentIndex;
  }
  const formArray = ctx.formGroup.get(`${playerString}Pets`) as FormArray;
  moveItemInArray(formArray.controls, previousIndex, currentIndex);
  formArray.updateValueAndValidity();
  refreshPetFormArrays(ctx);

  setTimeout(() => {
    for (const selector of ctx.petSelectors.toArray()) {
      selector.substitutePet();
    }
  });
}

export function resetPlayer(
  ctx: AppUiContext,
  player: 'player' | 'opponent',
): void {
  if (!confirm(`Are you sure you want to reset ${player}?`)) {
    return;
  }
  const petSelectors = ctx.petSelectors
    .toArray()
    .slice(player == 'player' ? 0 : 5, player == 'player' ? 5 : 10);
  for (const petSelector of petSelectors) {
    petSelector.removePet();
  }
  if (player === 'player') {
    ctx.formGroup.get('playerToy').setValue(null);
    ctx.formGroup.get('playerToyLevel').setValue(1);
    ctx.formGroup.get('playerHardToy').setValue(null);
    ctx.formGroup.get('playerHardToyLevel').setValue(1);
  } else {
    ctx.formGroup.get('opponentToy').setValue(null);
    ctx.formGroup.get('opponentToyLevel').setValue(1);
    ctx.formGroup.get('opponentHardToy').setValue(null);
    ctx.formGroup.get('opponentHardToyLevel').setValue(1);
  }
}

export function exportCalculator(ctx: AppUiContext): void {
  ctx.localStorageService.setFormStorage(ctx.formGroup);
  const calc = buildExportPayload(ctx.formGroup);
  navigator.clipboard
    .writeText(calc)
    .then(() => {
      ctx.setStatus?.('Copied to clipboard.', 'success');
    })
    .catch((error) => {
      console.error('Clipboard error:', error);
      ctx.setStatus?.('Failed to copy to clipboard.', 'error');
    });
}

export function importCalculator(
  ctx: AppUiContext,
  importVal: string,
  isInitialLoad: boolean = false,
): boolean {
  let success = false;
  try {
    const calculator = JSON.parse(importVal);

    applyCalculatorState(ctx, calculator);
    initApp(ctx);
    if (!isInitialLoad) {
      setTimeout(() => {
        if (ctx.petSelectors) {
          ctx.petSelectors.forEach((petSelector) => {
            petSelector.fixLoadEquipment();
          });
        }
      }, 0);
    }
    success = true;
  } catch (e) {
    console.error(e);
  }
  return success;
}

export function generateShareLink(ctx: AppUiContext): void {
  ctx.localStorageService.setFormStorage(ctx.formGroup);
  const baseUrl = window.location.origin + window.location.pathname;
  const shareableLink = buildShareableLink(ctx.formGroup, baseUrl);

  navigator.clipboard
    .writeText(shareableLink)
    .then(() => {
      ctx.setStatus?.('Shareable link copied to clipboard!', 'success');
    })
    .catch((err) => {
      console.error('Failed to copy link: ', err);
      ctx.setStatus?.('Failed to copy link. See console for details.', 'error');
    });
}
