import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Modal } from 'bootstrap';
import { Player } from '../classes/player.class';
import { Battle } from '../interfaces/battle.interface';
import { Log } from '../interfaces/log.interface';
import { LogService } from '../services/log.service';
import { AbilityService } from '../services/ability/ability.service';
import { GameService } from '../services/game.service';
import { PetService } from '../services/pet/pet.service';
import { ToyService } from '../services/toy/toy.service';
import { EquipmentService } from '../services/equipment/equipment.service';
import { LocalStorageService } from '../services/local-storage.service';
import { UrlStateService } from '../services/url-state.service';
import { CalculatorStateService } from '../services/calculator-state.service';
import { SimulationService } from '../services/simulation/simulation.service';
import {
  TeamPresetsService,
  TeamPreset,
} from '../services/team-presets.service';
import { PetSelectorComponent } from '../components/pet-selector/pet-selector.component';
import {
  ItemSelectionDialogComponent,
  SelectionType,
} from '../components/item-selection-dialog/item-selection-dialog.component';
import { PatchNotesComponent } from '../components/patch-notes/patch-notes.component';
import { CustomPackEditorComponent } from '../components/custom-pack-editor/custom-pack-editor.component';
import { InfoComponent } from '../components/info/info.component';
import { ImportCalculatorComponent } from '../components/import-calculator/import-calculator.component';
import { ReportABugComponent } from '../components/report-a-bug/report-a-bug.component';
import { ExportCalculatorComponent } from '../components/export-calculator/export-calculator.component';
import { BATTLE_BACKGROUNDS, LOG_FILTER_TABS } from './app.constants';
import { loadTeamPreset, saveTeamPreset } from './app.component.team-utils';
import { InjectorService } from '../services/injector.service';
import {
  buildApiResponse as buildApiResponseImpl,
  getDrawPercent as getDrawPercentImpl,
  getDrawWidth as getDrawWidthImpl,
  getLosePercent as getLosePercentImpl,
  getLoseWidth as getLoseWidthImpl,
  getWinPercent as getWinPercentImpl,
  LogMessagePart,
  refreshFilteredBattles as refreshFilteredBattlesImpl,
  refreshViewBattleLogRows as refreshViewBattleLogRowsImpl,
  runSimulation as runSimulationImpl,
  setViewBattle as setViewBattleImpl,
  simulate as simulateImpl,
} from './app.component.simulation';
import {
  applyCalculatorState as applyCalculatorStateImpl,
  clearCache as clearCacheImpl,
  decrementToyLevel as decrementToyLevelImpl,
  drop as dropImpl,
  exportCalculator as exportCalculatorImpl,
  fixCustomPackSelect as fixCustomPackSelectImpl,
  generateShareLink as generateShareLinkImpl,
  getPackIcon as getPackIconImpl,
  getRandomEquipment as getRandomEquipmentImpl,
  getRollInputVisible as getRollInputVisibleImpl,
  getSelectedTeamName as getSelectedTeamNameImpl,
  getSelectedTeamPreviewIcons as getSelectedTeamPreviewIconsImpl,
  getToyIcon as getToyIconImpl,
  getToyIconPathValue as getToyIconPathValueImpl,
  getToyOptionStyle as getToyOptionStyleImpl,
  getValidCustomPacks as getValidCustomPacksImpl,
  importCalculator as importCalculatorImpl,
  incrementToyLevel as incrementToyLevelImpl,
  initApp as initAppImpl,
  initFormGroup as initFormGroupImpl,
  initGameApi as initGameApiImpl,
  initPetForms as initPetFormsImpl,
  initPlayerPets as initPlayerPetsImpl,
  initModals as initModalsImpl,
  loadLocalStorage as loadLocalStorageImpl,
  loadStateFromUrl as loadStateFromUrlImpl,
  makeFormGroup as makeFormGroupImpl,
  onItemSelected as onItemSelectedImpl,
  onPackImageError as onPackImageErrorImpl,
  openCustomPackEditor as openCustomPackEditorImpl,
  openSelectionDialog as openSelectionDialogImpl,
  printFormGroup as printFormGroupImpl,
  randomize as randomizeImpl,
  randomizePlayerPets as randomizePlayerPetsImpl,
  refreshPetFormArrays as refreshPetFormArraysImpl,
  removeHardToy as removeHardToyImpl,
  resetPackImageError as resetPackImageErrorImpl,
  resetPlayer as resetPlayerImpl,
  setDayNight as setDayNightImpl,
  setHardToyImage as setHardToyImageImpl,
  setRandomBackground as setRandomBackgroundImpl,
  setToyImage as setToyImageImpl,
  toggleAdvanced as toggleAdvancedImpl,
  trackByIndex as trackByIndexImpl,
  trackByLogTab as trackByLogTabImpl,
  trackByTeamId as trackByTeamIdImpl,
  updateGoldSpent as updateGoldSpentImpl,
  undoRandomize as undoRandomizeImpl,
  updatePlayerPack as updatePlayerPackImpl,
  updatePlayerToy as updatePlayerToyImpl,
  updatePreviousShopTier as updatePreviousShopTierImpl,
  updateToyLevel as updateToyLevelImpl,
} from './app.component.ui-helpers';



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
    PatchNotesComponent,
    CustomPackEditorComponent,
    InfoComponent,
    ImportCalculatorComponent,
    ReportABugComponent,
    ExportCalculatorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
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
  battles: Battle[] = [];
  battleRandomEvents: LogMessagePart[][] = [];
  filteredBattlesCache: Battle[] = [];
  currBattle: Battle;
  viewBattle: Battle;
  simulated = false;
  formGroup: FormGroup;
  toys: Map<number, string[]>;
  regularToys: Map<number, string[]> = new Map();
  hardWackyToys: Map<number, string[]> = new Map();
  customPackEditorModal: Modal;

  previousPackPlayer = null;
  previousPackOpponent = null;

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
  apiResponse = null;

  showSelectionDialog = false;
  selectionType: SelectionType = 'pet';
  selectionSide: 'player' | 'opponent' | 'none' = 'none';

  showPatchNotes = false;
  showInfo = false;
  showImport = false;
  showExport = false;
  showReportABug = false;

  playerPetsControls: AbstractControl[] = [];
  opponentPetsControls: AbstractControl[] = [];
  viewBattleLogs: Log[] = [];
  viewBattleLogRows: Array<{ parts: LogMessagePart[]; classes: string[] }> = [];

  playerPackImageBroken = false;
  opponentPackImageBroken = false;
  undoState: any = null;

  private isLoadedFromUrl = false;
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  statusMessage = '';
  statusTone: 'success' | 'error' = 'success';

  readonly trackByIndex = trackByIndexImpl;
  readonly trackByTeamId = trackByTeamIdImpl;
  readonly trackByLogTab = trackByLogTabImpl;

  constructor(
    public logService: LogService,
    private injector: Injector,
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
    // this.loadLocalStorage();
    // this.initApp();
    // this.initGameApi();
    // this.setDayNight();

    // get the end of url
    // let url = window.location.href;
    // let urlSplit = url.split('/');
    // let lastUrl = urlSplit[urlSplit.length - 1];
    // let code = decodeURIComponent((lastUrl + '').replace(/\+/g, '%20'));;
    // // remove ?code= from string
    // code = code.replace('?code=', '');
    // if (code) {
    //   this.api = true;
    //   this.loadCalculatorFromValue(JSON.parse(code));
    //   this.simulate();
    //   this.buildApiResponse();
    // }
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

  readonly loadLocalStorage = () => loadLocalStorageImpl(this);
  readonly applyCalculatorState = (calculator: any) =>
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
  }

  readonly toggleAdvanced = () => toggleAdvancedImpl(this);
  readonly initPetForms = () => initPetFormsImpl(this);
  readonly refreshPetFormArrays = () => refreshPetFormArraysImpl(this);
  readonly updatePlayerPack = (
    player: Player,
    pack: string,
    randomize: boolean = true,
  ) => updatePlayerPackImpl(this, player, pack, randomize);
  readonly updatePlayerToy = (player: Player, toy: string) =>
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
  readonly runSimulation = (count: number = 1000) =>
    runSimulationImpl(this, count);

  get logs() {
    return this.logService.getLogs();
  }

  readonly setViewBattle = (battle: Battle) => setViewBattleImpl(this, battle);
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
  ): boolean => importCalculatorImpl(this, importVal, isInitialLoad);
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
  readonly onItemSelected = (item: any) => onItemSelectedImpl(this, item);
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

  setStatus(message: string, tone: 'success' | 'error' = 'success') {
    this.statusMessage = message;
    this.statusTone = tone;
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }
    this.statusTimer = setTimeout(() => {
      this.statusMessage = '';
      this.statusTimer = null;
    }, 3000);
  }

  clearStatus() {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
    this.statusMessage = '';
  }
}
