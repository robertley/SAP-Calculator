import { FormGroup } from '@angular/forms';
import { Battle } from 'app/domain/interfaces/battle.interface';
import {
  BattleDiffRow,
  BattleDiffScope,
  BattleDiffSummary,
  BattleLogEventFilter,
  BattleLogGroup,
  BattleLogRow,
  LogMessagePart,
  BattleTimelineRow,
} from '../simulation/app.component.simulation';
import { FightAnimationFrame } from '../simulation/app.component.fight-animation';
import { FightAnimationRenderFrameModel } from '../simulation/app.component.fight-animation-controls';
import type { AppComponent } from '../app.component';

export interface AppShellBattleResultsFacade {
  renderEpoch: number;
  formGroup: FormGroup;
  simulated: boolean;
  logFilterTabs: ReadonlyArray<{ value: string | null; label: string }>;
  filteredBattlesCache: Battle[];
  viewBattle: Battle | null;
  battles: Battle[];
  battleRandomEventsByBattle: Map<Battle, LogMessagePart[]>;
  trackByIndex: (index: number) => number;
  trackByLogTab: (index: number, tab: { value: string | null }) => string | null;
  setViewBattle: (battle: Battle) => void;
  toggleBattleAnalysis: () => void;
  showBattleAnalysis: boolean;
  logEventFilterOptions: ReadonlyArray<{
    value: BattleLogEventFilter;
    label: string;
  }>;
  logEventFilter: BattleLogEventFilter;
  setViewBattleLogFilter: (filter: BattleLogEventFilter) => void;
  currentFightAnimationRenderFrame: FightAnimationRenderFrameModel | null;
  currentFightAnimationLogRow: BattleLogRow | null;
  currentFightAnimationIsHeavyImpactFrame: boolean;
  currentFightAnimationIsBurstFrame: boolean;
  currentFightAnimationIsResolutionFrame: boolean;
  currentFightAnimationCadenceScale: number;
  currentFightAnimationImpactScale: number;
  fightAnimationMotionScale: number;
  getToyIconPath: (toyName: string | null) => string | null;
  fightSnipeIconSrc: string;
  fightAttackIconSrc: string;
  fightHealthIconSrc: string;
  fightExpIconSrc: string;
  fightManaIconSrc: string;
  fightTrumpetIconSrc: string;
  fightAnimationFrameIndex: number;
  fightAnimationFrames: FightAnimationFrame[];
  fightAnimationPlaying: boolean;
  resetFightAnimation: () => void;
  stepFightAnimation: (delta: number) => void;
  toggleFightAnimationPlayback: () => void;
  fightAnimationSpeedOptions: readonly number[];
  fightAnimationSpeed: number;
  setFightAnimationSpeed: (speed: number) => void;
  onFightAnimationScrub: (rawValue: string | number) => void;
  viewBattleTimelineRows: BattleTimelineRow[];
  diffBattleLeftIndex: number;
  diffBattleRightIndex: number;
  diffBattleLeftScope: BattleDiffScope;
  diffBattleRightScope: BattleDiffScope;
  setBattleDiffLeft: (index: number) => void;
  setBattleDiffRight: (index: number) => void;
  setBattleDiffLeftScope: (scope: BattleDiffScope) => void;
  setBattleDiffRightScope: (scope: BattleDiffScope) => void;
  battleDiffSummary: BattleDiffSummary;
  battleDiffRows: BattleDiffRow[];
  viewBattleLogGroups: BattleLogGroup[];
  toggleViewBattleLogGroup: (groupId: string) => void;
}

export function createAppShellBattleResultsFacade(
  app: AppComponent,
): AppShellBattleResultsFacade {
  return {
    get renderEpoch() {
      return app.shellRenderEpoch();
    },
    get formGroup() {
      return app.formGroup;
    },
    get simulated() {
      return app.simulated;
    },
    get logFilterTabs() {
      return app.logFilterTabs;
    },
    get filteredBattlesCache() {
      return app.filteredBattlesCache;
    },
    get viewBattle() {
      return app.viewBattle ?? null;
    },
    get battles() {
      return app.battles;
    },
    get battleRandomEventsByBattle() {
      return app.battleRandomEventsByBattle;
    },
    trackByIndex: app.trackByIndex,
    trackByLogTab: app.trackByLogTab,
    setViewBattle: (battle) => app.setViewBattle(battle),
    toggleBattleAnalysis: () => app.toggleBattleAnalysis(),
    get showBattleAnalysis() {
      return app.showBattleAnalysis;
    },
    set showBattleAnalysis(value: boolean) {
      app.showBattleAnalysis = value;
    },
    get logEventFilterOptions() {
      return app.logEventFilterOptions;
    },
    get logEventFilter() {
      return app.logEventFilter;
    },
    setViewBattleLogFilter: (filter) => app.setViewBattleLogFilter(filter),
    get currentFightAnimationRenderFrame() {
      return app.currentFightAnimationRenderFrame;
    },
    get currentFightAnimationLogRow() {
      return app.currentFightAnimationLogRow;
    },
    get currentFightAnimationIsHeavyImpactFrame() {
      return app.currentFightAnimationIsHeavyImpactFrame;
    },
    get currentFightAnimationIsBurstFrame() {
      return app.currentFightAnimationIsBurstFrame;
    },
    get currentFightAnimationIsResolutionFrame() {
      return app.currentFightAnimationIsResolutionFrame;
    },
    get currentFightAnimationCadenceScale() {
      return app.currentFightAnimationCadenceScale;
    },
    get currentFightAnimationImpactScale() {
      return app.currentFightAnimationImpactScale;
    },
    get fightAnimationMotionScale() {
      return app.fightAnimationMotionScale;
    },
    getToyIconPath: (toyName) => app.getToyIconPath(toyName),
    get fightSnipeIconSrc() {
      return app.fightSnipeIconSrc;
    },
    get fightAttackIconSrc() {
      return app.fightAttackIconSrc;
    },
    get fightHealthIconSrc() {
      return app.fightHealthIconSrc;
    },
    get fightExpIconSrc() {
      return app.fightExpIconSrc;
    },
    get fightManaIconSrc() {
      return app.fightManaIconSrc;
    },
    get fightTrumpetIconSrc() {
      return app.fightTrumpetIconSrc;
    },
    get fightAnimationFrameIndex() {
      return app.fightAnimationFrameIndex;
    },
    get fightAnimationFrames() {
      return app.fightAnimationFrames;
    },
    get fightAnimationPlaying() {
      return app.fightAnimationPlaying;
    },
    resetFightAnimation: () => app.resetFightAnimation(),
    stepFightAnimation: (delta) => app.stepFightAnimation(delta),
    toggleFightAnimationPlayback: () => app.toggleFightAnimationPlayback(),
    get fightAnimationSpeedOptions() {
      return app.fightAnimationSpeedOptions;
    },
    get fightAnimationSpeed() {
      return app.fightAnimationSpeed;
    },
    setFightAnimationSpeed: (speed) => app.setFightAnimationSpeed(speed),
    onFightAnimationScrub: (rawValue) => app.onFightAnimationScrub(rawValue),
    get viewBattleTimelineRows() {
      return app.viewBattleTimelineRows;
    },
    get diffBattleLeftIndex() {
      return app.diffBattleLeftIndex;
    },
    get diffBattleRightIndex() {
      return app.diffBattleRightIndex;
    },
    get diffBattleLeftScope() {
      return app.diffBattleLeftScope;
    },
    get diffBattleRightScope() {
      return app.diffBattleRightScope;
    },
    setBattleDiffLeft: (index) => app.setBattleDiffLeft(index),
    setBattleDiffRight: (index) => app.setBattleDiffRight(index),
    setBattleDiffLeftScope: (scope) => app.setBattleDiffLeftScope(scope),
    setBattleDiffRightScope: (scope) => app.setBattleDiffRightScope(scope),
    get battleDiffSummary() {
      return app.battleDiffSummary;
    },
    get battleDiffRows() {
      return app.battleDiffRows;
    },
    get viewBattleLogGroups() {
      return app.viewBattleLogGroups;
    },
    toggleViewBattleLogGroup: (groupId) => app.toggleViewBattleLogGroup(groupId),
  };
}
