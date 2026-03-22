import { AbstractControl, FormGroup } from '@angular/forms';
import { DragStartDelay } from '@angular/cdk/drag-drop';
import { Player } from 'app/domain/entities/player.class';
import type { SelectionType } from 'app/ui/components/item-selection-dialog/item-selection-dialog.types';
import type { AppComponent } from '../app.component';

export interface AppShellBoardFacade {
  player: Player;
  opponent: Player;
  playerPetsControls: AbstractControl[];
  opponentPetsControls: AbstractControl[];
  activePetSlot: { side: 'player' | 'opponent'; index: number } | null;
  petSlotDragDisabled: boolean;
  petSlotDragStartDelay: DragStartDelay;
  playerToyImageUrl: string;
  playerToyName: string;
  playerToyLevel: number;
  playerHardToyImageUrl: string;
  playerHardToyName: string;
  opponentToyImageUrl: string;
  opponentToyName: string;
  opponentToyLevel: number;
  opponentHardToyImageUrl: string;
  opponentHardToyName: string;
  allPets: boolean;
  mana: boolean;
  triggersConsumed: boolean;
  changeEquipmentUses: boolean;
  tokenPets: boolean;
  customPacks: AbstractControl | null;
  selectionDialogShowAllPets: boolean;
  trackByIndex: (index: number) => number;
  makeFormGroup: (control: AbstractControl) => FormGroup;
  openSelectionDialog: (
    type: SelectionType,
    side: 'player' | 'opponent' | 'none',
  ) => void;
  incrementToyLevel: (side: 'player' | 'opponent') => void;
  decrementToyLevel: (side: 'player' | 'opponent') => void;
  removeHardToy: (side: 'player' | 'opponent') => void;
  resetPlayer: (side: 'player' | 'opponent') => void;
  drop: (event: unknown, side: 'player' | 'opponent') => void;
  setActivePetSlot: (side: 'player' | 'opponent', index: number) => void;
}

export function createAppShellBoardFacade(
  app: AppComponent,
): AppShellBoardFacade {
  return {
    get player() {
      return app.player;
    },
    get opponent() {
      return app.opponent;
    },
    get playerPetsControls() {
      return app.playerPetsControls;
    },
    get opponentPetsControls() {
      return app.opponentPetsControls;
    },
    get activePetSlot() {
      return app.activePetSlot;
    },
    get petSlotDragDisabled() {
      return (
        app.overlayState.showSelectionDialog ||
        app.petSelectors?.toArray().some((selector) => selector.showSelectionDialog) ||
        false
      );
    },
    get petSlotDragStartDelay() {
      return app.petSlotDragStartDelay;
    },
    get playerToyImageUrl() {
      return app.playerToyImageUrl;
    },
    get playerToyName() {
      return app.formGroup.get('playerToy')?.value ?? 'Select Toy';
    },
    get playerToyLevel() {
      return Number(app.formGroup.get('playerToyLevel')?.value ?? 1);
    },
    get playerHardToyImageUrl() {
      return app.playerHardToyImageUrl;
    },
    get playerHardToyName() {
      return app.formGroup.get('playerHardToy')?.value ?? 'Hard Toy';
    },
    get opponentToyImageUrl() {
      return app.opponentToyImageUrl;
    },
    get opponentToyName() {
      return app.formGroup.get('opponentToy')?.value ?? 'Select Toy';
    },
    get opponentToyLevel() {
      return Number(app.formGroup.get('opponentToyLevel')?.value ?? 1);
    },
    get opponentHardToyImageUrl() {
      return app.opponentHardToyImageUrl;
    },
    get opponentHardToyName() {
      return app.formGroup.get('opponentHardToy')?.value ?? 'Hard Toy';
    },
    get allPets() {
      return Boolean(app.formGroup.get('allPets')?.value);
    },
    get mana() {
      return Boolean(app.formGroup.get('mana')?.value);
    },
    get triggersConsumed() {
      return Boolean(app.formGroup.get('triggersConsumed')?.value);
    },
    get changeEquipmentUses() {
      return Boolean(app.formGroup.get('changeEquipmentUses')?.value);
    },
    get tokenPets() {
      return Boolean(app.formGroup.get('tokenPets')?.value);
    },
    get customPacks() {
      return app.formGroup.get('customPacks');
    },
    get selectionDialogShowAllPets() {
      return Boolean(app.formGroup.get('allPets')?.value);
    },
    trackByIndex: app.trackByIndex,
    makeFormGroup: (control) => app.makeFormGroup(control),
    openSelectionDialog: (type, side) => app.openSelectionDialog(type, side),
    incrementToyLevel: (side) => app.incrementToyLevel(side),
    decrementToyLevel: (side) => app.decrementToyLevel(side),
    removeHardToy: (side) => app.removeHardToy(side),
    resetPlayer: (side) => app.resetPlayer(side),
    drop: (event, side) => app.drop(event as never, side),
    setActivePetSlot: (side, index) => app.setActivePetSlot(side, index),
  };
}
