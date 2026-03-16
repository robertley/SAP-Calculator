import { FormGroup } from '@angular/forms';
import { RandomDecisionCapture } from 'app/domain/interfaces/simulation-config.interface';
import {
  LogMessagePart,
  PositioningDeltaSummary,
} from '../simulation/app.component.simulation';
import type { SelectionType } from 'app/ui/components/item-selection-dialog/item-selection-dialog.types';
import type { AppComponent } from '../app.component';

export interface AppShellControlsFacade {
  renderEpoch: number;
  formGroup: FormGroup;
  simulations: number;
  simulationInProgress: boolean;
  simulationCancelRequested: boolean;
  simulationProgress: number;
  simulationProgressLabel: string;
  simulated: boolean;
  playerWinner: number;
  opponentWinner: number;
  draw: number;
  winPercent: number;
  drawPercent: number;
  losePercent: number;
  positioningDeltaSummary: PositioningDeltaSummary | null;
  positioningDeltaSideLabel: 'Player' | 'Opponent';
  theme: 'light' | 'dark';
  soundMenuOpen: boolean;
  soundVolume: number;
  soundVolumePercent: number;
  soundMuted: boolean;
  showInfo: boolean;
  showReportABug: boolean;
  showExport: boolean;
  showImport: boolean;
  statusMessage: string;
  statusTone: 'success' | 'error';
  autoSaveLabel: string;
  undoState: unknown;
  rollInputVisible: boolean;
  teamName: string;
  selectedTeamName: string;
  selectedTeamPreviewIcons: string[];
  playerPackImageBroken: boolean;
  opponentPackImageBroken: boolean;
  playerPackName: string;
  opponentPackName: string;
  playerPackIconPath: string | null;
  opponentPackIconPath: string | null;
  showRandomOverrides: boolean;
  randomDecisions: RandomDecisionCapture[];
  randomOverrideError: string | null;
  trackByIndex: (index: number) => number;
  simulate: (count?: number) => void;
  cancelSimulation: () => void;
  optimizePositioning: (side: 'player' | 'opponent') => void;
  randomize: () => void;
  undoRandomize: () => void;
  formatSignedPercentDelta: (value: number) => string;
  toggleTheme: () => void;
  toggleSoundMenu: () => void;
  setSoundVolume: (value: number | string) => void;
  toggleSoundMuted: () => void;
  generateShareLink: () => void;
  markForCheck: () => void;
  toggleAdvanced: () => void;
  refreshDebugLogPresentation: () => void;
  toggleRandomOverrides: () => void;
  captureRandomEvents: () => void;
  runForcedRandomSimulation: () => void;
  clearRandomOverrides: () => void;
  getRandomDecisionLabelParts: (
    decision: RandomDecisionCapture,
  ) => LogMessagePart[];
  getRandomDecisionSelectedOptionParts: (
    decision: RandomDecisionCapture,
  ) => LogMessagePart[];
  getSelectedRandomDecisionOptionId: (
    decision: RandomDecisionCapture,
  ) => string;
  onRandomDecisionChoiceChanged: (
    decision: RandomDecisionCapture,
    optionId: string,
  ) => void;
  getPackIconPath: (packName: string | null | undefined) => string | null;
  onPackImageError: (side: 'player' | 'opponent') => void;
  openSelectionDialog: (
    type: SelectionType,
    side: 'player' | 'opponent' | 'none',
  ) => void;
  saveTeam: (side: 'player' | 'opponent') => void;
  loadTeam: (side: 'player' | 'opponent') => void;
}

export function createAppShellControlsFacade(
  app: AppComponent,
): AppShellControlsFacade {
  return {
    get renderEpoch() {
      return app.shellRenderEpoch();
    },
    get formGroup() {
      return app.formGroup;
    },
    get simulations() {
      return Number(app.formGroup.get('simulations')?.value ?? 0);
    },
    get simulationInProgress() {
      return app.simulationInProgress;
    },
    get simulationCancelRequested() {
      return app.simulationCancelRequested;
    },
    get simulationProgress() {
      return app.simulationProgress;
    },
    get simulationProgressLabel() {
      return app.simulationProgressLabel;
    },
    get simulated() {
      return app.simulated;
    },
    get playerWinner() {
      return app.playerWinner;
    },
    get opponentWinner() {
      return app.opponentWinner;
    },
    get draw() {
      return app.draw;
    },
    get winPercent() {
      return app.winPercent;
    },
    get drawPercent() {
      return app.drawPercent;
    },
    get losePercent() {
      return app.losePercent;
    },
    get positioningDeltaSummary() {
      return app.positioningDeltaSummary;
    },
    get positioningDeltaSideLabel() {
      return app.positioningDeltaSideLabel;
    },
    formatSignedPercentDelta: (value) => app.formatSignedPercentDelta(value),
    get theme() {
      return app.theme;
    },
    toggleTheme: () => app.toggleTheme(),
    get soundMenuOpen() {
      return app.soundMenuOpen;
    },
    set soundMenuOpen(value: boolean) {
      app.soundMenuOpen = value;
    },
    toggleSoundMenu: () => app.toggleSoundMenu(),
    get soundVolume() {
      return app.soundVolume;
    },
    setSoundVolume: (value) => app.setSoundVolume(value),
    get soundVolumePercent() {
      return app.soundVolumePercent;
    },
    get soundMuted() {
      return app.soundMuted;
    },
    toggleSoundMuted: () => app.toggleSoundMuted(),
    get showInfo() {
      return app.overlayState.showInfo;
    },
    set showInfo(value: boolean) {
      app.overlayState.showInfo = value;
    },
    get showReportABug() {
      return app.overlayState.showReportABug;
    },
    set showReportABug(value: boolean) {
      app.overlayState.showReportABug = value;
    },
    get showExport() {
      return app.overlayState.showExport;
    },
    set showExport(value: boolean) {
      app.overlayState.showExport = value;
    },
    get showImport() {
      return app.overlayState.showImport;
    },
    set showImport(value: boolean) {
      app.overlayState.showImport = value;
    },
    generateShareLink: () => app.generateShareLink(),
    toggleAdvanced: () => app.toggleAdvanced(),
    refreshDebugLogPresentation: () => app.refreshDebugLogPresentation(),
    get statusMessage() {
      return app.statusMessage;
    },
    get statusTone() {
      return app.statusTone;
    },
    get autoSaveLabel() {
      return app.autoSaveLabel;
    },
    get undoState() {
      return app.undoState;
    },
    get rollInputVisible() {
      return app.rollInputVisible;
    },
    get teamName() {
      return app.teamName;
    },
    set teamName(value: string) {
      app.teamName = value;
    },
    get selectedTeamName() {
      return app.selectedTeamName;
    },
    get selectedTeamPreviewIcons() {
      return app.selectedTeamPreviewIcons;
    },
    saveTeam: (side) => app.saveTeam(side),
    loadTeam: (side) => app.loadTeam(side),
    get playerPackImageBroken() {
      return app.playerPackImageBroken;
    },
    get opponentPackImageBroken() {
      return app.opponentPackImageBroken;
    },
    get playerPackName() {
      return app.formGroup.get('playerPack')?.value ?? 'Select Pack';
    },
    get opponentPackName() {
      return app.formGroup.get('opponentPack')?.value ?? 'Select Pack';
    },
    get playerPackIconPath() {
      return app.getPackIconPath(app.formGroup.get('playerPack')?.value);
    },
    get opponentPackIconPath() {
      return app.getPackIconPath(app.formGroup.get('opponentPack')?.value);
    },
    getPackIconPath: (packName) => app.getPackIconPath(packName),
    onPackImageError: (side) => app.onPackImageError(side),
    openSelectionDialog: (type, side) => app.openSelectionDialog(type, side),
    simulate: (count) => app.simulate(count),
    cancelSimulation: () => app.cancelSimulation(),
    optimizePositioning: (side) => app.optimizePositioning(side),
    randomize: () => app.randomize(),
    undoRandomize: () => app.undoRandomize(),
    markForCheck: () => app.markForCheck(),
    get showRandomOverrides() {
      return app.showRandomOverrides;
    },
    set showRandomOverrides(value: boolean) {
      app.showRandomOverrides = value;
    },
    toggleRandomOverrides: () => app.toggleRandomOverrides(),
    get randomDecisions() {
      return app.randomDecisions;
    },
    get randomOverrideError() {
      return app.randomOverrideError;
    },
    captureRandomEvents: () => app.captureRandomEvents(),
    runForcedRandomSimulation: () => app.runForcedRandomSimulation(),
    clearRandomOverrides: () => app.clearRandomOverrides(),
    getRandomDecisionLabelParts: (decision) =>
      app.getRandomDecisionLabelParts(decision),
    getRandomDecisionSelectedOptionParts: (decision) =>
      app.getRandomDecisionSelectedOptionParts(decision),
    getSelectedRandomDecisionOptionId: (decision) =>
      app.getSelectedRandomDecisionOptionId(decision),
    onRandomDecisionChoiceChanged: (decision, optionId) =>
      app.onRandomDecisionChoiceChanged(decision, optionId),
    trackByIndex: app.trackByIndex,
  };
}
