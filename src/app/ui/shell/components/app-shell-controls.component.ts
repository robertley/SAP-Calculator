import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { AppComponent } from '../app.component';

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
})
export class AppShellControlsComponent {
  @Input({ required: true }) app: AppComponent;
  @ViewChild('soundMenuRoot') soundMenuRoot?: ElementRef<HTMLElement>;

  optimizeSide: 'player' | 'opponent' = 'player';
  saveSide: 'player' | 'opponent' = 'player';
  loadSide: 'player' | 'opponent' = 'player';

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
    return this.activeAdvancedSettingsCount + this.randomOverrideCount;
  }

  get unifiedAdvancedSummary(): string {
    const advancedCount = this.activeAdvancedSettingsCount;
    const randomCount = this.randomOverrideCount;
    const packSummary = `Packs: ${this.getControlDisplayValue('playerPack', 'None')} vs ${this.getControlDisplayValue('opponentPack', 'None')}.`;

    if (!advancedCount && !randomCount) {
      return `${packSummary} No scenario tweaks active.`;
    }
    if (advancedCount && randomCount) {
      return `${packSummary} ${advancedCount} advanced setting${advancedCount === 1 ? '' : 's'} and ${randomCount} random override${randomCount === 1 ? '' : 's'} active.`;
    }
    if (advancedCount) {
      return `${packSummary} ${advancedCount} advanced setting${advancedCount === 1 ? '' : 's'} active.`;
    }
    return `${packSummary} ${randomCount} random override${randomCount === 1 ? '' : 's'} captured.`;
  }

  private get randomOverrideCount(): number {
    return this.app?.randomDecisions?.length ?? 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.app?.soundMenuOpen) {
      return;
    }
    const target = event.target as Node | null;
    const root = this.soundMenuRoot?.nativeElement;
    if (!target || !root) {
      this.app.soundMenuOpen = false;
      this.app.markForCheck();
      return;
    }
    if (root.contains(target)) {
      return;
    }
    this.app.soundMenuOpen = false;
    this.app.markForCheck();
  }

  resetScenarioSettings(): void {
    if (!this.app?.formGroup) {
      return;
    }

    this.app.formGroup.patchValue(SCENARIO_CONTROL_RESET_VALUES);
    this.app.refreshDebugLogPresentation();
  }

  private getControlDisplayValue(controlName: string, fallback: string): string {
    const value = this.app?.formGroup?.get(controlName)?.value;
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    return String(value);
  }
}
