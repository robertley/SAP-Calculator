import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoardStrengthDialogComponent } from '../../components/board-strength-dialog/board-strength-dialog.component';
import { ImportCalculatorComponent } from '../../components/import-calculator/import-calculator.component';
import type { AppShellControlsFacade } from './app-shell-controls.facade';
import { getEquipmentIconPath, getPetIconPath } from 'app/runtime/asset-catalog';

type ToolsWorkspaceTab =
  | 'optimize'
  | 'outs'
  | 'strength'
  | 'randomness'
  | 'teams'
  | 'odds-image'
  | 'positioning-image'
  | 'strength-image';

const ADVANCED_CONTROL_DEFAULTS: Readonly<Record<string, boolean | number | null>> = {
  komodoShuffle: false,
  changeEquipmentUses: false,
  mana: false,
  logsEnabled: true,
  triggersConsumed: false,
  showTriggerNamesInLogs: false,
  showPositionalArgsInLogs: true,
  turn: 11,
  seed: null,
  playerGoldSpent: 10,
  opponentGoldSpent: 10,
  playerRollAmount: 4,
  opponentRollAmount: 4,
  playerLevel3Sold: 0,
  opponentLevel3Sold: 0,
  playerSummonedAmount: 0,
  opponentSummonedAmount: 0,
  playerTransformationAmount: 0,
  opponentTransformationAmount: 0,
};

const SCENARIO_CONTROL_RESET_VALUES: Readonly<Record<string, boolean | number | null>> = {
  komodoShuffle: false,
  changeEquipmentUses: false,
  mana: false,
  logsEnabled: true,
  triggersConsumed: false,
  showTriggerNamesInLogs: false,
  showPositionalArgsInLogs: true,
  turn: 1,
  seed: null,
  playerGoldSpent: 0,
  opponentGoldSpent: 0,
  playerRollAmount: 0,
  opponentRollAmount: 0,
  playerLevel3Sold: 0,
  opponentLevel3Sold: 0,
  playerSummonedAmount: 0,
  opponentSummonedAmount: 0,
  playerTransformationAmount: 0,
  opponentTransformationAmount: 0,
};

@Component({
  selector: 'app-shell-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgOptimizedImage, BoardStrengthDialogComponent, ImportCalculatorComponent],
  templateUrl: './app-shell-controls.component.html',
  styleUrl: './app-shell-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellControlsComponent {
  @Input({ required: true }) app: AppShellControlsFacade;
  @Input() renderEpoch = 0;
  @ViewChild('soundMenuRoot') soundMenuRoot?: ElementRef<HTMLElement>;

  optimizeSide: 'player' | 'opponent' = 'player';
  outFinderSide: 'player' | 'opponent' = 'player';
  outFinderShopTier = 6;
  saveSide: 'player' | 'opponent' = 'player';
  toolsDialogOpen = false;
  optimizationDialogOpen = false;
  teamLibraryDialogOpen = false;
  activeToolsTab: ToolsWorkspaceTab = 'optimize';
  actionsMenuOpen = false;

  get isUnifiedAdvancedExpanded(): boolean {
    return Boolean(this.app?.formGroup?.get('showAdvanced')?.value);
  }

  get activeAdvancedSettingsCount(): number {
    if (!this.app?.formGroup) {
      return 0;
    }
    return Object.entries(ADVANCED_CONTROL_DEFAULTS).reduce(
      (count, [controlName, defaultValue]) => {
        const currentValue = this.app.formGroup.get(controlName)?.value;
        return count + (currentValue !== defaultValue ? 1 : 0);
      },
      0,
    );
  }

  get activeAdvancedOverridesCount(): number {
    return this.activeAdvancedSettingsCount;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    const element = event.target instanceof Element ? event.target : null;
    const root = this.soundMenuRoot?.nativeElement;
    if (!target || !root || !element) {
      this.closeMenus();
      return;
    }
    if (root.contains(target) || element.closest('.run-utility-group')) {
      return;
    }
    this.closeMenus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.teamLibraryDialogOpen) {
      this.closeTeamLibraryDialog();
      return;
    }
    if (this.optimizationDialogOpen) {
      this.closeOptimizationDialog();
      return;
    }
    if (this.toolsDialogOpen) {
      this.closeToolsDialog();
      return;
    }
    if (this.isUnifiedAdvancedExpanded) {
      this.app.toggleAdvanced();
      return;
    }
    this.closeMenus();
  }

  runOptimization(): void {
    this.app.optimizePositioning(this.optimizeSide);
    this.closeToolsDialog();
  }

  runOutFinder(): void {
    this.app.findOuts(this.outFinderSide, this.outFinderShopTier);
  }

  onOutFinderScopeChanged(): void {
    this.app.clearOutFinderResult();
  }

  formatOutDelta(value: number): string {
    const percentagePoints = value * 100;
    return `${percentagePoints >= 0 ? '+' : ''}${percentagePoints.toFixed(1)}pp`;
  }

  outActionLabel(replacedIndex: number | null, targetIndex: number, type: 'pet' | 'food'): string {
    if (type === 'food') return targetIndex < 0 ? 'All pets' : `Pet ${targetIndex + 1}`;
    return replacedIndex == null
      ? `Add at position ${targetIndex + 1}`
      : `Replace pet ${replacedIndex + 1} · position ${targetIndex + 1}`;
  }

  outIcon(type: 'pet' | 'food', name: string): string {
    return type === 'pet' ? getPetIconPath(name) : getEquipmentIconPath(name);
  }

  openOptimizationDialog(): void {
    if (this.app.simulationInProgress) {
      return;
    }
    this.toolsDialogOpen = false;
    this.optimizationDialogOpen = true;
  }

  closeOptimizationDialog(): void {
    this.optimizationDialogOpen = false;
  }

  openTeamLibraryDialog(): void {
    this.toolsDialogOpen = false;
    this.teamLibraryDialogOpen = true;
  }

  closeTeamLibraryDialog(): void {
    this.teamLibraryDialogOpen = false;
  }

  openToolsDialog(): void {
    this.toolsDialogOpen = true;
    this.actionsMenuOpen = false;
  }

  closeToolsDialog(): void {
    this.toolsDialogOpen = false;
  }

  selectToolsTab(tab: ToolsWorkspaceTab): void {
    if (this.app.simulationInProgress && (tab === 'optimize' || tab === 'strength')) {
      return;
    }
    this.activeToolsTab = tab;
  }

  toggleActionsMenu(): void {
    this.actionsMenuOpen = !this.actionsMenuOpen;
    this.toolsDialogOpen = false;
  }

  closeActionsMenu(): void {
    this.actionsMenuOpen = false;
  }

  private closeMenus(): void {
    this.actionsMenuOpen = false;
    if (this.app?.soundMenuOpen) {
      this.app.soundMenuOpen = false;
    }
    this.app?.markForCheck();
  }

  resetScenarioSettings(): void {
    if (!this.app?.formGroup) {
      return;
    }

    this.app.formGroup.patchValue(SCENARIO_CONTROL_RESET_VALUES);
    this.app.refreshDebugLogPresentation();
  }

}
