import { Injectable } from '@angular/core';
import type { SelectionType } from 'app/ui/components/item-selection-dialog/item-selection-dialog.types';

@Injectable({ providedIn: 'root' })
export class AppShellOverlayStateService {
  showSelectionDialog = false;
  selectionType: SelectionType = 'pet';
  selectionSide: 'player' | 'opponent' | 'none' = 'none';
  showInfo = false;
  showImport = false;
  showExport = false;
  showReportABug = false;

  openSelectionDialog(
    type: SelectionType,
    side: 'player' | 'opponent' | 'none',
  ): void {
    this.selectionType = type;
    this.selectionSide = side;
    this.showSelectionDialog = true;
  }

  closeSelectionDialog(): void {
    this.showSelectionDialog = false;
    this.selectionSide = 'none';
  }
}
