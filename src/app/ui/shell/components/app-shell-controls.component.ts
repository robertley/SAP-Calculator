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
import type { AppShellControlsFacade } from './app-shell-controls.facade';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './app-shell-controls.component.html',
  styleUrl: './app-shell-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellControlsComponent {
  @Input({ required: true }) app: AppShellControlsFacade;
  @Input() renderEpoch = 0;
  @ViewChild('soundMenuRoot') soundMenuRoot?: ElementRef<HTMLElement>;

  optimizeSide: 'player' | 'opponent' = 'player';
  saveSide: 'player' | 'opponent' = 'player';
  loadSide: 'player' | 'opponent' = 'player';
  optimizationDialogOpen = false;
  toolsMenuOpen = false;
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
    if (this.optimizationDialogOpen) {
      this.closeOptimizationDialog();
      return;
    }
    if (this.isUnifiedAdvancedExpanded) {
      this.app.toggleAdvanced();
      return;
    }
    this.closeMenus();
  }

  openOptimizationDialog(): void {
    if (this.app.simulationInProgress) {
      return;
    }
    this.optimizationDialogOpen = true;
    this.closeMenus();
  }

  closeOptimizationDialog(): void {
    this.optimizationDialogOpen = false;
  }

  runOptimization(): void {
    this.app.optimizePositioning(this.optimizeSide);
    this.closeOptimizationDialog();
  }

  toggleToolsMenu(): void {
    this.toolsMenuOpen = !this.toolsMenuOpen;
    this.actionsMenuOpen = false;
  }

  closeToolsMenu(): void {
    this.toolsMenuOpen = false;
  }

  toggleActionsMenu(): void {
    this.actionsMenuOpen = !this.actionsMenuOpen;
    this.toolsMenuOpen = false;
  }

  closeActionsMenu(): void {
    this.actionsMenuOpen = false;
  }

  private closeMenus(): void {
    this.toolsMenuOpen = false;
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
