import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Injector, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Modal } from 'bootstrap';
import { Player } from 'app/domain/entities/player.class';
import { Battle } from 'app/domain/interfaces/battle.interface';
import { Log } from 'app/domain/interfaces/log.interface';
import {
  RandomDecisionCapture,
  SimulationConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import { LogService } from 'app/integrations/log.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { LocalStorageService } from 'app/runtime/state/local-storage.service';
import { UrlStateService } from 'app/runtime/state/url-state.service';
import { CalculatorStateService } from 'app/runtime/state/calculator-state.service';
import { SimulationService } from 'app/integrations/simulation/simulation.service';
import { TeamPresetsService, TeamPreset, } from 'app/integrations/team-presets.service';
import { PetSelectorComponent } from 'app/ui/components/pet-selector/pet-selector.component';
import { ItemSelectionDialogComponent, SelectionType, } from 'app/ui/components/item-selection-dialog/item-selection-dialog.component';
import { CustomPackEditorComponent } from 'app/ui/components/custom-pack-editor/custom-pack-editor.component';
import { InfoComponent } from 'app/ui/components/info/info.component';
import { ImportCalculatorComponent } from 'app/ui/components/import-calculator/import-calculator.component';
import { ReportABugComponent } from 'app/ui/components/report-a-bug/report-a-bug.component';
import { ExportCalculatorComponent } from 'app/ui/components/export-calculator/export-calculator.component';
import { AppShellControlsComponent } from './components/app-shell-controls.component';
import { AppShellBattleResultsComponent } from './components/app-shell-battle-results.component';
import { BATTLE_BACKGROUNDS, LOG_FILTER_TABS } from './view/app.ui.constants';
import { loadTeamPreset, saveTeamPreset } from './state/app.component.teams';
import { InjectorService } from 'app/integrations/injector.service';
import { BattleDiffScope, BattleDiffRow, BattleDiffSummary, BattleTimelineRow, buildApiResponse as buildApiResponseImpl, refreshBattleDiff as refreshBattleDiffImpl, getDrawPercent as getDrawPercentImpl, getDrawWidth as getDrawWidthImpl, getLosePercent as getLosePercentImpl, getLoseWidth as getLoseWidthImpl, getWinPercent as getWinPercentImpl, LogMessagePart, optimizePositioning as optimizePositioningImpl, refreshFilteredBattles as refreshFilteredBattlesImpl, refreshViewBattleTimeline as refreshViewBattleTimelineImpl, refreshViewBattleLogRows as refreshViewBattleLogRowsImpl, runSimulation as runSimulationImpl, cancelSimulation as cancelSimulationImpl, setBattleDiffLeft as setBattleDiffLeftImpl, setBattleDiffLeftScope as setBattleDiffLeftScopeImpl, setBattleDiffRight as setBattleDiffRightImpl, setBattleDiffRightScope as setBattleDiffRightScopeImpl, setViewBattle as setViewBattleImpl, simulate as simulateImpl, } from './simulation/app.component.simulation';
import {
  FightAnimationDeath,
  FightAnimationFrame,
  FightAnimationPopup,
} from './simulation/app.component.fight-animation';
import { clearFightAnimationTimer as clearFightAnimationTimerImpl, getFightDeathForSlot as getFightDeathForSlotImpl, getFightPopupText as getFightPopupTextImpl, getFightPopupsForSlot as getFightPopupsForSlotImpl, getFightShiftSteps as getFightShiftStepsImpl, isFightAttackerSlot as isFightAttackerSlotImpl, isFightDeathSlot as isFightDeathSlotImpl, isFightShiftedSlot as isFightShiftedSlotImpl, isFightTargetSlot as isFightTargetSlotImpl, onFightAnimationScrub as onFightAnimationScrubImpl, refreshFightAnimationFromViewBattle as refreshFightAnimationFromViewBattleImpl, resetFightAnimation as resetFightAnimationImpl, setFightAnimationSpeed as setFightAnimationSpeedImpl, stepFightAnimation as stepFightAnimationImpl, toggleFightAnimationPlayback as toggleFightAnimationPlaybackImpl, } from './simulation/app.component.fight-animation-controls';
import { captureRandomEvents as captureRandomEventsImpl, clearRandomOverrides as clearRandomOverridesImpl, getRandomDecisionLabelParts as getRandomDecisionLabelPartsImpl, getRandomDecisionSelectedOptionParts as getRandomDecisionSelectedOptionPartsImpl, getSelectedRandomDecisionOptionId as getSelectedRandomDecisionOptionIdImpl, onRandomDecisionChoiceChanged as onRandomDecisionChoiceChangedImpl, runForcedRandomSimulation as runForcedRandomSimulationImpl, } from './simulation/app.component.random-decisions';
import { applyCalculatorState as applyCalculatorStateImpl, clearCache as clearCacheImpl, decrementToyLevel as decrementToyLevelImpl, drop as dropImpl, exportCalculator as exportCalculatorImpl, fixCustomPackSelect as fixCustomPackSelectImpl, generateShareLink as generateShareLinkImpl, getPackIcon as getPackIconImpl, getRandomEquipment as getRandomEquipmentImpl, getRollInputVisible as getRollInputVisibleImpl, getSelectedTeamName as getSelectedTeamNameImpl, getSelectedTeamPreviewIcons as getSelectedTeamPreviewIconsImpl, getToyIcon as getToyIconImpl, getToyIconPathValue as getToyIconPathValueImpl, getToyOptionStyle as getToyOptionStyleImpl, getValidCustomPacks as getValidCustomPacksImpl, importCalculator as importCalculatorImpl, incrementToyLevel as incrementToyLevelImpl, initApp as initAppImpl, initFormGroup as initFormGroupImpl, initGameApi as initGameApiImpl, initPetForms as initPetFormsImpl, initPlayerPets as initPlayerPetsImpl, initModals as initModalsImpl, loadLocalStorage as loadLocalStorageImpl, loadStateFromUrl as loadStateFromUrlImpl, makeFormGroup as makeFormGroupImpl, onItemSelected as onItemSelectedImpl, onPackImageError as onPackImageErrorImpl, openCustomPackEditor as openCustomPackEditorImpl, openSelectionDialog as openSelectionDialogImpl, printFormGroup as printFormGroupImpl, randomize as randomizeImpl, randomizePlayerPets as randomizePlayerPetsImpl, refreshPetFormArrays as refreshPetFormArraysImpl, removeHardToy as removeHardToyImpl, resetPackImageError as resetPackImageErrorImpl, resetPlayer as resetPlayerImpl, setDayNight as setDayNightImpl, setHardToyImage as setHardToyImageImpl, setRandomBackground as setRandomBackgroundImpl, setToyImage as setToyImageImpl, toggleAdvanced as toggleAdvancedImpl, trackByIndex as trackByIndexImpl, trackByLogTab as trackByLogTabImpl, trackByTeamId as trackByTeamIdImpl, updateGoldSpent as updateGoldSpentImpl, undoRandomize as undoRandomizeImpl, updatePlayerPack as updatePlayerPackImpl, updatePlayerToy as updatePlayerToyImpl, updatePreviousShopTier as updatePreviousShopTierImpl, updateToyLevel as updateToyLevelImpl, } from './view/app.component.ui';
import { handlePetSlotClipboardShortcuts as handlePetSlotClipboardShortcutsImpl } from './view/app.component.pet-clipboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    PetSelectorComponent,
    ItemSelectionDialogComponent,
    CustomPackEditorComponent,
    InfoComponent,
    ImportCalculatorComponent,
    ReportABugComponent,
    ExportCalculatorComponent,
    AppShellControlsComponent,
    AppShellBattleResultsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly app = this;
  readonly lapsusTypographyStage: 1 | 2 | 3 = 1;

  get lapsusTypographyStageClass(): string {
    return `lapsus-stage-${this.lapsusTypographyStage}`;
  }

  @ViewChildren(PetSelectorComponent)
  petSelectors: QueryList<PetSelectorComponent>;

  @ViewChild('customPackEditor')
  customPackEditor: ElementRef;

  version = '0.9.3';
  sapVersion = '0.33.3-156 BETA'
  lastUpdated = '1/20/2026';

  title = 'sap-calculator';
  player: Player;
  opponent: Player;
  maxTurns = 71;
  turns = 0;
  attackCount = 0;
  battleStarted = false;

  simulationBattleAmt = 1000;
  playerWinner = 0;
  opponentWinner = 0;
  draw = 0;
  simulationInProgress = false;
  simulationProgress = 0;
  simulationProgressLabel = '';
  simulationCancelRequested = false;
  simulationWorker: Worker | null = null;
  simulationRunId = 0;
  battles: Battle[] = [];
  battleRandomEvents: LogMessagePart[][] = [];
  battleRandomEventsByBattle = new Map<Battle, LogMessagePart[]>();
  filteredBattlesCache: Battle[] = [];
  randomDecisions: RandomDecisionCapture[] = [];
  randomOverrideError: string | null = null;
  randomDecisionSelectionByFingerprint: Record<string, string> = {};
  randomDecisionPartsCache = new Map<string, LogMessagePart[]>();
  currBattle: Battle;
  viewBattle: Battle;
  simulated = false;
  formGroup: FormGroup;
  toys: Map<number, string[]>;
  regularToys: Map<number, string[]> = new Map();
  hardWackyToys: Map<number, string[]> = new Map();
  customPackEditorModal: Modal;

  previousPackPlayer: string | null = null;
  previousPackOpponent: string | null = null;

  dayNight = true;
  battleBackgroundUrl = '';
  playerToyImageUrl = '';
  opponentToyImageUrl = '';
  playerHardToyImageUrl = '';
  opponentHardToyImageUrl = '';
  savedTeams: TeamPreset[] = [];
  selectedTeamId = '';
  teamName = '';
  battleBackgrounds = [...BATTLE_BACKGROUNDS];
  logFilterTabs = [...LOG_FILTER_TABS];
  api = false;
  apiResponse: string | null = null;

  showSelectionDialog = false;
  selectionType: SelectionType = 'pet';
  selectionSide: 'player' | 'opponent' | 'none' = 'none';

  showInfo = false;
  showImport = false;
  showExport = false;
  showReportABug = false;
  showBattleAnalysis = false;
  battleViewMode: 'logs' | 'animate' = 'logs';
  fightAnimationFrames: FightAnimationFrame[] = [];
  fightAnimationFrameIndex = -1;
  fightAnimationPlaying = false;
  fightAnimationSpeed = 1;
  readonly fightAttackIconSrc = '/assets/art/Public/Public/Icons/fist-from-textmap.png';
  readonly fightHealthIconSrc = '/assets/art/Public/Public/Icons/heart-from-textmap.png';

  playerPetsControls: AbstractControl[] = [];
  opponentPetsControls: AbstractControl[] = [];
  viewBattleLogs: Log[] = [];
  viewBattleLogRows: Array<{ parts: LogMessagePart[]; classes: string[] }> = [];
  viewBattleTimelineRows: BattleTimelineRow[] = [];
  diffBattleLeftIndex = 0;
  diffBattleRightIndex = 0;
  diffBattleLeftScope: BattleDiffScope = 'all';
  diffBattleRightScope: BattleDiffScope = 'all';
  battleDiffRows: BattleDiffRow[] = [];
  battleDiffSummary: BattleDiffSummary = {
    equalSteps: 0,
    changedSteps: 0,
    leftOnly: 0,
    rightOnly: 0,
  };

  playerPackImageBroken = false;
  opponentPackImageBroken = false;
  undoState: unknown = null;

  private isLoadedFromUrl = false;
  private statusTimer: ReturnType<typeof setTimeout> | null = null;
  fightAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  private formAutoSaveSubscription: Subscription | null = null;

  statusMessage = '';
  statusTone: 'success' | 'error' = 'success';
  lastAutoSavedAt: Date | null = null;
  activePetSlot: { side: 'player' | 'opponent'; index: number } | null = null;
  petClipboard: Record<string, unknown> | null = null;

  readonly trackByIndex = trackByIndexImpl;
  readonly trackByTeamId = trackByTeamIdImpl;
  readonly trackByLogTab = trackByLogTabImpl;
  readonly toggleBattleAnalysis = () => {
    this.showBattleAnalysis = !this.showBattleAnalysis;
  };
  readonly setBattleViewMode = (mode: 'logs' | 'animate') => {
    this.battleViewMode = mode;
    this.cdr.markForCheck();
  };
  readonly refreshFightAnimationFromViewBattle = () =>
    refreshFightAnimationFromViewBattleImpl(this);
  readonly toggleFightAnimationPlayback = () =>
    toggleFightAnimationPlaybackImpl(this);
  readonly resetFightAnimation = () => resetFightAnimationImpl(this);
  readonly stepFightAnimation = (delta: number) =>
    stepFightAnimationImpl(this, delta);
  readonly setFightAnimationSpeed = (speed: number) =>
    setFightAnimationSpeedImpl(this, speed);
  readonly onFightAnimationScrub = (rawValue: string | number) =>
    onFightAnimationScrubImpl(this, rawValue);
  readonly isFightAttackerSlot = (side: 'player' | 'opponent', slot: number) =>
    isFightAttackerSlotImpl(this, side, slot);
  readonly isFightTargetSlot = (side: 'player' | 'opponent', slot: number) =>
    isFightTargetSlotImpl(this, side, slot);
  readonly getFightPopupsForSlot = (
    side: 'player' | 'opponent',
    slot: number,
  ): FightAnimationPopup[] => getFightPopupsForSlotImpl(this, side, slot);
  readonly getFightPopupText = (popup: FightAnimationPopup): string =>
    getFightPopupTextImpl(popup);
  readonly isFightDeathSlot = (side: 'player' | 'opponent', slot: number) =>
    isFightDeathSlotImpl(this, side, slot);
  readonly getFightDeathForSlot = (
    side: 'player' | 'opponent',
    slot: number,
  ): FightAnimationDeath | null => getFightDeathForSlotImpl(this, side, slot);
  readonly isFightShiftedSlot = (side: 'player' | 'opponent', slot: number) =>
    isFightShiftedSlotImpl(this, side, slot);
  readonly getFightShiftSteps = (side: 'player' | 'opponent', slot: number) =>
    getFightShiftStepsImpl(this, side, slot);

  constructor(
    public logService: LogService,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private abilityService: AbilityService,
    public gameService: GameService,
    public petService: PetService,
    public toyService: ToyService,
    public equipmentService: EquipmentService,
    public localStorageService: LocalStorageService,
    public urlStateService: UrlStateService,
    public calculatorStateService: CalculatorStateService,
    public simulationService: SimulationService,
    private teamPresetsService: TeamPresetsService,
  ) {
    InjectorService.setInjector(this.injector);
    this.player = new Player(logService, abilityService, gameService);
    this.opponent = new Player(logService, abilityService, gameService);
    this.opponent.isOpponent = true;
    this.gameService.init(this.player, this.opponent);
    this.petService.init();
    this.initFormGroup();
    const apiState = this.urlStateService.parseApiStateFromUrl();
    if (apiState.state) {
      this.api = true;
      this.applyCalculatorState(apiState.state);
      this.simulate();
      this.buildApiResponse();
    } else if (apiState.error) {
      console.error(apiState.error);
      this.apiResponse = JSON.stringify({
        error: 'Invalid or corrupted data provided in the URL.',
      });
    }
  }

  get rollInputVisible(): boolean {
    return getRollInputVisibleImpl(this);
  }

  readonly buildApiResponse = () => buildApiResponseImpl(this);
  readonly printFormGroup = () => printFormGroupImpl(this);

  ngOnInit(): void {
    this.isLoadedFromUrl = this.loadStateFromUrl(true);

    if (!this.isLoadedFromUrl) {
      this.loadLocalStorage();
    }

    this.initApp();
    this.loadTeamPresets();
    this.setRandomBackground();
    this.initGameApi();
    this.setDayNight();
    this.toys = this.toyService.toys;
    this.regularToys = this.toyService.getToysByType(0);
    this.hardWackyToys = this.toyService.getToysByType(1);

    this.formAutoSaveSubscription?.unsubscribe();
    this.formAutoSaveSubscription = this.formGroup.valueChanges
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.localStorageService.setFormStorage(this.formGroup);
        this.lastAutoSavedAt = new Date();
        this.cdr.markForCheck();
      });
  }

  get autoSaveLabel(): string {
    if (!this.lastAutoSavedAt) {
      return '';
    }
    return `Saved ${this.lastAutoSavedAt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`;
  }

  readonly loadStateFromUrl = (
    isInitialLoad: boolean = false,
  ): boolean => loadStateFromUrlImpl(this, isInitialLoad);

  ngAfterViewInit(): void {
    if (this.isLoadedFromUrl) {
      this.petSelectors.forEach((petSelector) => {
        petSelector.fixLoadEquipment();
      });
    }

    if (!this.api) {
      this.initModals();
    }
  }

  ngOnDestroy(): void {
    this.formAutoSaveSubscription?.unsubscribe();
    this.clearFightAnimationTimer();
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
  }

  readonly loadLocalStorage = () => loadLocalStorageImpl(this);
  readonly applyCalculatorState = (calculator: unknown) =>
    applyCalculatorStateImpl(this, calculator);
  readonly setDayNight = () => setDayNightImpl(this);
  readonly setRandomBackground = () => setRandomBackgroundImpl(this);
  readonly fixCustomPackSelect = () => fixCustomPackSelectImpl(this);
  readonly initApp = () => initAppImpl(this);
  readonly initGameApi = () => initGameApiImpl(this);
  readonly initPlayerPets = () => initPlayerPetsImpl(this);
  readonly randomizePlayerPets = (player: Player) =>
    randomizePlayerPetsImpl(this, player);
  readonly makeFormGroup = makeFormGroupImpl;
  readonly setActivePetSlot = (
    side: 'player' | 'opponent',
    index: number,
  ) => {
    this.activePetSlot = { side, index };
  };

  @HostListener('document:keydown', ['$event'])
  handlePetSlotClipboardShortcuts(event: KeyboardEvent): void {
    handlePetSlotClipboardShortcutsImpl(this, event);
  }

  initFormGroup() {
    initFormGroupImpl(this);
    this.formGroup.get('logFilter')?.valueChanges.subscribe(() => {
      this.refreshFilteredBattles();
    });
    this.formGroup.get('simulations')?.valueChanges.subscribe((val) => {
      if (val > 10000) {
        this.formGroup
          .get('simulations')
          ?.setValue(10000, { emitEvent: false });
      }
    });
    this.formGroup.get('seed')?.valueChanges.subscribe((val) => {
      if (val === '' || val == null) {
        return;
      }
      const parsed = Number(val);
      if (!Number.isFinite(parsed)) {
        this.formGroup.get('seed')?.setValue(null, { emitEvent: false });
        return;
      }
      const normalized = Math.trunc(parsed);
      if (normalized !== parsed) {
        this.formGroup.get('seed')?.setValue(normalized, { emitEvent: false });
      }
    });
  }

  readonly toggleAdvanced = () => toggleAdvancedImpl(this);
  readonly initPetForms = () => initPetFormsImpl(this);
  readonly refreshPetFormArrays = () => refreshPetFormArraysImpl(this);
  readonly updatePlayerPack = (
    player: Player,
    pack: string,
    randomize: boolean = true,
  ) => updatePlayerPackImpl(this, player, pack, randomize);
  readonly updatePlayerToy = (player: Player, toy: string | null) =>
    updatePlayerToyImpl(this, player, toy);
  readonly setToyImage = (player: Player, toyName: string | null) =>
    setToyImageImpl(this, player, toyName);
  readonly setHardToyImage = (player: Player, toyName: string | null) =>
    setHardToyImageImpl(this, player, toyName);
  readonly updatePreviousShopTier = (turn: number) =>
    updatePreviousShopTierImpl(this, turn);
  readonly updateGoldSpent = (
    player: number | null,
    opponent: number | null,
  ) => updateGoldSpentImpl(this, player, opponent);
  readonly updateToyLevel = (player: Player, level: number) =>
    updateToyLevelImpl(this, player, level);
  readonly getRandomEquipment = () => getRandomEquipmentImpl(this);
  readonly simulate = (count: number = 1000) => simulateImpl(this, count);
  readonly runSimulation = (
    count: number = 1000,
    configOverrides?: Partial<SimulationConfig>,
  ) => runSimulationImpl(this, count, configOverrides);
  readonly cancelSimulation = () => cancelSimulationImpl(this);
  readonly optimizePositioning = (side: 'player' | 'opponent') =>
    optimizePositioningImpl(
      this,
      side,
      this.formGroup.get('simulations').value ?? 1000,
    );
  readonly afterPositioningApplied = () => {
    this.refreshPetFormArrays();
    setTimeout(() => {
      for (const selector of this.petSelectors.toArray()) {
        selector.substitutePet();
      }
    });
  };
  readonly markForCheck = () => this.cdr.markForCheck();

  readonly captureRandomEvents = () => captureRandomEventsImpl(this);

  readonly clearRandomOverrides = () => clearRandomOverridesImpl(this);

  readonly runForcedRandomSimulation = () => runForcedRandomSimulationImpl(this);

  readonly onRandomDecisionChoiceChanged = (
    decision: RandomDecisionCapture,
    optionId: string,
  ) => onRandomDecisionChoiceChangedImpl(this, decision, optionId);

  readonly getRandomDecisionLabelParts = (
    decision: RandomDecisionCapture,
  ): LogMessagePart[] => getRandomDecisionLabelPartsImpl(this, decision);

  readonly getRandomDecisionSelectedOptionParts = (
    decision: RandomDecisionCapture,
  ): LogMessagePart[] => getRandomDecisionSelectedOptionPartsImpl(this, decision);

  readonly getSelectedRandomDecisionOptionId = (
    decision: RandomDecisionCapture,
  ): string => getSelectedRandomDecisionOptionIdImpl(this, decision);

  get logs() {
    return this.logService.getLogs();
  }
  get currentFightAnimationFrame(): FightAnimationFrame | null {
    if (
      this.fightAnimationFrameIndex < 0 ||
      this.fightAnimationFrameIndex >= this.fightAnimationFrames.length
    ) {
      return null;
    }
    return this.fightAnimationFrames[this.fightAnimationFrameIndex] ?? null;
  }

  get currentFightAnimationLogIndex(): number {
    return this.currentFightAnimationFrame?.logIndex ?? -1;
  }

  readonly setViewBattle = (battle: Battle) => setViewBattleImpl(this, battle);
  readonly refreshViewBattleTimeline = () =>
    refreshViewBattleTimelineImpl(this);
  readonly refreshBattleDiff = () => refreshBattleDiffImpl(this);
  readonly setBattleDiffLeft = (index: number) =>
    setBattleDiffLeftImpl(this, index);
  readonly setBattleDiffRight = (index: number) =>
    setBattleDiffRightImpl(this, index);
  readonly setBattleDiffLeftScope = (scope: BattleDiffScope) =>
    setBattleDiffLeftScopeImpl(this, scope);
  readonly setBattleDiffRightScope = (scope: BattleDiffScope) =>
    setBattleDiffRightScopeImpl(this, scope);
  readonly refreshViewBattleLogRows = () =>
    refreshViewBattleLogRowsImpl(this);
  get drawWidth() {
    return getDrawWidthImpl(this);
  }
  get loseWidth() {
    return getLoseWidthImpl(this);
  }

  saveTeam(side: 'player' | 'opponent') {
    const result = saveTeamPreset({
      side,
      teamName: this.teamName,
      formGroup: this.formGroup,
      savedTeams: this.savedTeams,
      selectedTeamId: this.selectedTeamId,
      teamPresetsService: this.teamPresetsService,
    });
    this.savedTeams = result.savedTeams;
    this.selectedTeamId = result.selectedTeamId;
    this.teamName = result.teamName;
  }

  loadTeam(side: 'player' | 'opponent') {
    loadTeamPreset({
      side,
      selectedTeamId: this.selectedTeamId,
      savedTeams: this.savedTeams,
      formGroup: this.formGroup,
      player: this.player,
      opponent: this.opponent,
      petService: this.petService,
      equipmentService: this.equipmentService,
      initPetForms: () => this.initPetForms(),
    });
  }

  private loadTeamPresets() {
    this.savedTeams = this.teamPresetsService.loadTeams();
  }

  /**
   * Randomizes both player and opponent if no player is provided.
   * @param player
   */
  readonly randomize = (player?: Player) => randomizeImpl(this, player);
  readonly undoRandomize = () => undoRandomizeImpl(this);
  readonly clearCache = () => clearCacheImpl(this);
  readonly initModals = () => initModalsImpl(this);
  readonly openCustomPackEditor = () => openCustomPackEditorImpl(this);
  readonly drop = (event: CdkDragDrop<string[]>, playerString: string) =>
    dropImpl(this, event, playerString);
  readonly resetPlayer = (player: 'player' | 'opponent') =>
    resetPlayerImpl(this, player);
  readonly export = () => exportCalculatorImpl(this);
  readonly import = (
    importVal: string,
    isInitialLoad: boolean = false,
    options?: { resetBattle?: boolean },
  ): boolean => importCalculatorImpl(this, importVal, isInitialLoad, options);
  readonly importForDialog = (
    importVal: string,
    options?: { resetBattle?: boolean },
  ): boolean => importCalculatorImpl(this, importVal, false, options);
  readonly generateShareLink = () => generateShareLinkImpl(this);
  readonly refreshFilteredBattles = () => refreshFilteredBattlesImpl(this);

  get winPercent() {
    return getWinPercentImpl(this);
  }

  get drawPercent() {
    return getDrawPercentImpl(this);
  }

  get losePercent() {
    return getLosePercentImpl(this);
  }

  get validCustomPacks() {
    return getValidCustomPacksImpl(this);
  }

  readonly getToyIcon = getToyIconImpl;

  get selectedTeamName(): string {
    return getSelectedTeamNameImpl(this);
  }

  get selectedTeamPreviewIcons(): string[] {
    return getSelectedTeamPreviewIconsImpl(this);
  }

  readonly getToyOptionStyle = getToyOptionStyleImpl;

  readonly openSelectionDialog = (
    type: SelectionType,
    side: 'player' | 'opponent' | 'none',
  ) => openSelectionDialogImpl(this, type, side);
  readonly onItemSelected = (item: unknown) => onItemSelectedImpl(this, item);
  readonly getPackIconPath = getPackIconImpl;
  readonly onPackImageError = (side: 'player' | 'opponent') =>
    onPackImageErrorImpl(this, side);
  readonly resetPackImageError = (
    side: 'player' | 'opponent',
    packName: string,
  ) => resetPackImageErrorImpl(this, side, packName);
  readonly incrementToyLevel = (side: 'player' | 'opponent') =>
    incrementToyLevelImpl(this, side);
  readonly decrementToyLevel = (side: 'player' | 'opponent') =>
    decrementToyLevelImpl(this, side);
  readonly removeHardToy = (side: 'player' | 'opponent') =>
    removeHardToyImpl(this, side);
  readonly getToyIconPath = getToyIconPathValueImpl;

  private clearFightAnimationTimer(): void {
    clearFightAnimationTimerImpl(this);
  }

  setStatus(message: string, tone: 'success' | 'error' = 'success') {
    this.statusMessage = message;
    this.statusTone = tone;
    this.cdr.markForCheck();
    this.clearStatusTimer();
    this.statusTimer = setTimeout(() => {
      this.statusMessage = '';
      this.statusTimer = null;
      this.cdr.markForCheck();
    }, 3000);
  }

  clearStatus() {
    this.clearStatusTimer();
    this.statusMessage = '';
    this.cdr.markForCheck();
  }

  private clearStatusTimer(): void {
    if (!this.statusTimer) {
      return;
    }
    clearTimeout(this.statusTimer);
    this.statusTimer = null;
  }
}

