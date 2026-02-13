import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Player } from 'app/domain/entities/player.class';
import { SelectionType } from 'app/ui/components/item-selection-dialog/item-selection-dialog.component';
import { getPackIconPath, getToyIconPath } from 'app/runtime/asset-catalog';
import {
  buildExportPayload,
  buildShareableLink,
  expandCompactCalculatorState,
  parseImportPayload,
} from '../state/app.component.share';
import { AppUiContext } from './app.component.ui-common';
import { clearPlayerToy, randomizePlayerPets, randomizePlayerToy } from './app.component.ui-pack-toy';
import {
  applyCalculatorState,
  initApp,
  initPetForms,
  refreshPetFormArrays,
} from './app.component.ui';

export function openSelectionDialog(
  ctx: AppUiContext,
  type: SelectionType,
  side: 'player' | 'opponent' | 'none',
): void {
  ctx.selectionType = type;
  ctx.selectionSide = side;
  ctx.showSelectionDialog = true;
}

export function onItemSelected(ctx: AppUiContext, item: unknown): void {
  if (item instanceof Event) {
    ctx.showSelectionDialog = false;
    ctx.selectionSide = 'none';
    return;
  }
  const itemRecord =
    item && typeof item === 'object'
      ? (item as { id?: unknown; name?: unknown; item?: unknown })
      : null;
  if (!ctx.selectionSide || ctx.selectionSide === 'none') {
    if (ctx.selectionType === 'team') {
      ctx.selectedTeamId =
        typeof item === 'string'
          ? item
          : typeof itemRecord?.id === 'string'
            ? itemRecord.id
            : typeof itemRecord?.name === 'string'
              ? itemRecord.name
              : '';
    }
    ctx.showSelectionDialog = false;
    ctx.selectionSide = 'none';
    return;
  }

  const side = ctx.selectionSide;
  const type = ctx.selectionType;

  if (type === 'pack') {
    const packName =
      typeof item === 'string'
        ? item
        : typeof itemRecord?.name === 'string'
          ? itemRecord.name
          : null;
    if (side === 'player') {
      ctx.formGroup.get('playerPack').setValue(packName);
    } else {
      ctx.formGroup.get('opponentPack').setValue(packName);
    }
  } else if (type === 'toy') {
    const rawToyName =
      typeof item === 'string'
        ? item
        : typeof itemRecord?.name === 'string'
          ? itemRecord.name
          : null;
    const toyName =
      typeof rawToyName === 'string' &&
      rawToyName.trim().toLowerCase() === 'none'
        ? null
        : rawToyName;
    if (side === 'player') {
      ctx.formGroup.get('playerToy').setValue(toyName);
    } else {
      ctx.formGroup.get('opponentToy').setValue(toyName);
    }
  } else if (type === 'hard-toy') {
    const rawToyName =
      typeof item === 'string'
        ? item
        : typeof itemRecord?.name === 'string'
          ? itemRecord.name
          : null;
    const toyName =
      typeof rawToyName === 'string' &&
      rawToyName.trim().toLowerCase() === 'none'
        ? null
        : rawToyName;
    if (side === 'player') {
      ctx.formGroup.get('playerHardToy').setValue(toyName);
    } else {
      ctx.formGroup.get('opponentHardToy').setValue(toyName);
    }
  } else if (type === 'team') {
    ctx.selectedTeamId =
      typeof item === 'string'
        ? item
        : typeof itemRecord?.id === 'string'
          ? itemRecord.id
          : typeof itemRecord?.name === 'string'
            ? itemRecord.name
            : '';
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

  const allPetsSelected = ctx.formGroup.get('allPets').value;
  if (player) {
    player.allPets = ctx.formGroup.get('allPets').value;
    player.tokenPets = ctx.formGroup.get('tokenPets').value;
    randomizePlayerPets(ctx, player);
    if (allPetsSelected) {
      randomizePlayerToy(ctx, player);
    } else {
      clearPlayerToy(ctx, player);
    }
  } else {
    ctx.player.allPets = ctx.formGroup.get('allPets').value;
    ctx.player.tokenPets = ctx.formGroup.get('tokenPets').value;
    ctx.opponent.allPets = ctx.formGroup.get('allPets').value;
    ctx.opponent.tokenPets = ctx.formGroup.get('tokenPets').value;
    randomizePlayerPets(ctx, ctx.player);
    randomizePlayerPets(ctx, ctx.opponent);
    if (allPetsSelected) {
      randomizePlayerToy(ctx, ctx.player);
      randomizePlayerToy(ctx, ctx.opponent);
    } else {
      clearPlayerToy(ctx, ctx.player);
      clearPlayerToy(ctx, ctx.opponent);
    }
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
  options?: { resetBattle?: boolean },
): boolean {
  let success = false;
  try {
    const calculator = expandCompactCalculatorState(parseImportPayload(importVal));

    if (options?.resetBattle) {
      resetSimulationState(ctx);
    }
    if (ctx.petSelectors?.length) {
      resetPlayer(ctx, 'player');
      resetPlayer(ctx, 'opponent');
    }

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

function resetSimulationState(ctx: AppUiContext): void {
  ctx.simulated = false;
  ctx.battles = [];
  ctx.battleRandomEvents = [];
  ctx.battleRandomEventsByBattle = new Map();
  ctx.filteredBattlesCache = [];
  ctx.viewBattle = null;
  ctx.viewBattleLogs = [];
  ctx.viewBattleLogRows = [];
  ctx.playerWinner = 0;
  ctx.opponentWinner = 0;
  ctx.draw = 0;
  ctx.apiResponse = null;
  ctx.battleStarted = false;
  ctx.currBattle = null;
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






