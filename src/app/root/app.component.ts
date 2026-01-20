import { Component, Injector, ViewChildren, QueryList, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Player } from '../classes/player.class';
import { Pet } from '../classes/pet.class';

import { InjectorService } from '../services/injector.service';
import { LogService } from '../services/log.service';
import { Battle } from '../interfaces/battle.interface';
import { money_round } from '../util/helper-functions';
import { GameService } from '../services/game.service';
import { Log } from '../interfaces/log.interface';
import { AbilityService } from '../services/ability/ability.service';

import { PetService } from '../services/pet/pet.service';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PetSelectorComponent } from '../components/pet-selector/pet-selector.component';
import { ItemSelectionDialogComponent, SelectionType } from '../components/item-selection-dialog/item-selection-dialog.component';
import { ToyService } from '../services/toy/toy.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Modal } from 'bootstrap';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UrlStateService } from '../services/url-state.service';
import { CalculatorStateService } from '../services/calculator-state.service';
import { SimulationService } from '../services/simulation/simulation.service';
import { EquipmentService } from '../services/equipment/equipment.service';
import { TeamPresetsService, TeamPreset } from '../services/team-presets.service';
import { getToyIconPath, getPackIconPath, getPetIconPath } from '../util/asset-utils';
import { BATTLE_BACKGROUND_BASE, BATTLE_BACKGROUNDS, DAY, LOG_FILTER_TABS, NIGHT, TOY_ART_BASE } from './app.constants';
import { PatchNotesComponent } from '../components/patch-notes/patch-notes.component';
import { CustomPackEditorComponent } from '../components/custom-pack-editor/custom-pack-editor.component';
import { InfoComponent } from '../components/info/info.component';
import { ImportCalculatorComponent } from '../components/import-calculator/import-calculator.component';
import { ReportABugComponent } from '../components/report-a-bug/report-a-bug.component';
import { ExportCalculatorComponent } from '../components/export-calculator/export-calculator.component';
import { createAppFormGroup, initPetForms } from './app.component.form-utils';
import { loadTeamPreset, saveTeamPreset } from './app.component.team-utils';
import { buildApiResponse, buildExportPayload, buildShareableLink } from './app.component.share-utils';
import { shouldShowRollInputs } from './app.component.roll-utils';


// TODO
// Weak as equipment option
// parrot copy abomination log bug?
// move turn to not advanced?
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
    ExportCalculatorComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dayNight', [
      state('day', style({
        backgroundColor: DAY
      })),
      state('night', style({
        backgroundColor: NIGHT
      })),
      transition('day <=> night', [
        animate('0.5s')
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChildren(PetSelectorComponent)
  petSelectors: QueryList<PetSelectorComponent>;

  @ViewChild('customPackEditor')
  customPackEditor: ElementRef;

  version = '0.9.3';
  sapVersion = '0.33.3-156 BETA'
  lastUpdated = '1/14/2026';

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
  battleRandomEvents: string[] = [];
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
  private battleBackgrounds = [...BATTLE_BACKGROUNDS];
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
  viewBattleLogRows: Array<{ message: string; classes: string[] }> = [];

  playerPackImageBroken = false;
  opponentPackImageBroken = false;


  private isLoadedFromUrl = false;

  trackByIndex(index: number): number {
    return index;
  }

  trackByTeamId(index: number, team: TeamPreset): string {
    return team?.id ?? String(index);
  }

  trackByLogTab(index: number, tab: { value: string | null }): string {
    return tab?.value ?? String(index);
  }

  constructor(private logService: LogService,
    private injector: Injector,
    private abilityService: AbilityService,
    private gameService: GameService,
    private petService: PetService,
    private toyService: ToyService,
    private equipmentService: EquipmentService,
    private localStorageService: LocalStorageService,
    private urlStateService: UrlStateService,
    private calculatorStateService: CalculatorStateService,
    private simulationService: SimulationService,
    private teamPresetsService: TeamPresetsService
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
      this.apiResponse = JSON.stringify({ error: "Invalid or corrupted data provided in the URL." });
    }
  }


  get rollInputVisible(): boolean {
    return this.formGroup.get('showAdvanced').value || shouldShowRollInputs([this.player, this.opponent]);
  }

  buildApiResponse() {
    this.apiResponse = buildApiResponse(this.playerWinner, this.opponentWinner, this.draw);
  }

  printFormGroup() {
    console.log(this.formGroup)
  }

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

  loadStateFromUrl(isInitialLoad: boolean = false): boolean {
    const parsedState = this.urlStateService.parseCalculatorStateFromUrl();
    if (!parsedState.state) {
      if (parsedState.error) {
        console.error(parsedState.error);
        alert("Could not load the shared calculator link. The data may be corrupted.");
      }
      return false;
    }

    const success = this.import(JSON.stringify(parsedState.state), isInitialLoad);
    if (success) {
      console.log("Calculator state loaded from URL.");
    }
    return success;
  }


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

  loadLocalStorage() {
    let localStorage = this.localStorageService.getStorage();

    if (localStorage) {
      try {
        // all fields except for customPacks
        let localStorage = JSON.parse(this.localStorageService.getStorage());
        this.applyCalculatorState(localStorage);
      } catch (e) {
        console.log('error loading local storage', e)
        this.localStorageService.clearStorage();
      }

    }
  }

  applyCalculatorState(calculator) {
    this.calculatorStateService.applyCalculatorState(
      this.formGroup,
      calculator,
      this.dayNight,
      () => this.fixCustomPackSelect()
    );
  }

  setDayNight() {
    let turn = this.formGroup.get('turn').value;
    let day = turn % 2 == 1;
    this.dayNight = day;
    this.gameService.gameApi.day = day;

  }

  setRandomBackground() {
    if (!this.battleBackgrounds.length) {
      this.battleBackgroundUrl = '';
      return;
    }
    const idx = Math.floor(Math.random() * this.battleBackgrounds.length);
    this.battleBackgroundUrl = `${BATTLE_BACKGROUND_BASE}${this.battleBackgrounds[idx]}`;
  }

  fixCustomPackSelect() {
    this.formGroup.get('playerPack').setValue(this.formGroup.get('playerPack').value, { emitEvent: false });
    this.formGroup.get('opponentPack').setValue(this.formGroup.get('opponentPack').value, { emitEvent: false });
  }

  initApp() {
    this.petService.buildCustomPackPets(this.formGroup.get('customPacks') as FormArray);
    this.initPlayerPets();
    this.updatePlayerPack(this.player, this.formGroup.get('playerPack').value, false);
    this.updatePlayerPack(this.opponent, this.formGroup.get('opponentPack').value, false);
    this.updatePlayerToy(this.player, this.formGroup.get('playerToy').value);
    this.updatePlayerToy(this.opponent, this.formGroup.get('opponentToy').value);
    this.gameService.gameApi.playerHardToy = this.formGroup.get('playerHardToy').value;
    this.gameService.gameApi.playerHardToyLevel = this.formGroup.get('playerHardToyLevel').value;
    this.gameService.gameApi.opponentHardToy = this.formGroup.get('opponentHardToy').value;
    this.gameService.gameApi.opponentHardToyLevel = this.formGroup.get('opponentHardToyLevel').value;
    this.setHardToyImage(this.player, this.formGroup.get('playerHardToy').value);
    this.setHardToyImage(this.opponent, this.formGroup.get('opponentHardToy').value);
    this.previousPackOpponent = this.opponent.pack;
    this.previousPackPlayer = this.player.pack;
  }

  initGameApi() {
    this.gameService.gameApi.day = this.dayNight;
    this.gameService.gameApi.oldStork = this.formGroup.get('oldStork').value;
    this.gameService.gameApi.komodoShuffle = this.formGroup.get('komodoShuffle').value;
    this.gameService.gameApi.mana = this.formGroup.get('mana').value;
    this.gameService.gameApi.playerRollAmount = this.formGroup.get('playerRollAmount').value;
    this.gameService.gameApi.opponentRollAmount = this.formGroup.get('opponentRollAmount').value;
    this.gameService.gameApi.playerLevel3Sold = this.formGroup.get('playerLevel3Sold').value;
    this.gameService.gameApi.opponentLevel3Sold = this.formGroup.get('opponentLevel3Sold').value;
    this.gameService.gameApi.playerSummonedAmount = this.formGroup.get('playerSummonedAmount').value;
    this.gameService.gameApi.opponentSummonedAmount = this.formGroup.get('opponentSummonedAmount').value;
    this.gameService.gameApi.playerTransformationAmount = this.formGroup.get('playerTransformationAmount').value;
    this.gameService.gameApi.opponentTransformationAmount = this.formGroup.get('opponentTransformationAmount').value;
  }

  initPlayerPets() {
    for (let i = 0; i < 5; i++) {
      let petForm = (this.formGroup.get('playerPets') as FormArray).controls[i] as FormGroup;
      if (petForm.get('name').value == null) {
        continue;
      }
      let pet = this.petService.createPet(petForm.value, this.player);
      this.player.setPet(i, pet, true);
    }
    for (let i = 0; i < 5; i++) {
      let petForm = (this.formGroup.get('opponentPets') as FormArray).controls[i] as FormGroup;
      if (petForm.get('name').value == null) {
        continue;
      }
      let pet = this.petService.createPet(petForm.value, this.opponent);
      this.opponent.setPet(i, pet, true);
    }
  }

  randomizePlayerPets(player: Player) {
    for (let i = 0; i < 5; i++) {
      const pet = this.petService.getRandomPet(player);
      pet.equipment = this.getRandomEquipment();
      player.setPet(i, pet, true);
    }
  }

  makeFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  initFormGroup() {
    this.formGroup = createAppFormGroup({
      player: this.player,
      opponent: this.opponent,
      gameService: this.gameService,
      toyService: this.toyService,
      updatePreviousShopTier: (turn) => this.updatePreviousShopTier(turn),
      updateGoldSpent: (player, opponent) => this.updateGoldSpent(player, opponent),
      setDayNight: () => this.setDayNight(),
      openCustomPackEditor: () => this.openCustomPackEditor(),
      resetPackImageError: (side, packName) => this.resetPackImageError(side, packName),
      updatePlayerPack: (player, pack, randomize) => this.updatePlayerPack(player, pack, randomize),
      updatePlayerToy: (player, toy) => this.updatePlayerToy(player, toy),
      updateToyLevel: (player, level) => this.updateToyLevel(player, level),
      setHardToyImage: (player, toyName) => this.setHardToyImage(player, toyName)
    });
    this.refreshPetFormArrays();
    this.formGroup.get('logFilter')?.valueChanges.subscribe(() => {
      this.refreshFilteredBattles();
    });
  }

  toggleAdvanced() {
    let advanced = this.formGroup.get('showAdvanced').value;
    this.formGroup.get('showAdvanced').setValue(!advanced);
  }

  initPetForms() {
    initPetForms(this.formGroup, this.player, this.opponent);
    this.refreshPetFormArrays();
  }

  refreshPetFormArrays() {
    this.playerPetsControls = Array.from((this.formGroup.get('playerPets') as FormArray).controls).reverse();
    this.opponentPetsControls = Array.from((this.formGroup.get('opponentPets') as FormArray).controls);
  }

  updatePlayerPack(player: Player, pack, randomize = true) {
    player.pack = pack;
    let petPool;
    switch (pack) {
      case 'Turtle':
        petPool = this.petService.turtlePackPets;
        break;
      case 'Puppy':
        petPool = this.petService.puppyPackPets;
        break;
      case 'Star':
        petPool = this.petService.starPackPets;
        break;
      case 'Golden':
        petPool = this.petService.goldenPackPets;
        break;
      case 'Unicorn':
        petPool = this.petService.unicornPackPets;
        break;
      case 'Danger':
        petPool = this.petService.dangerPackPets;
        break;
      default:
        petPool = this.petService.playerCustomPackPets.get(pack);
        break;
    }
    // console.log('petPool', petPool)
    if (player == this.player) {
      this.gameService.setTierGroupPets(petPool, null);
    } else {
      this.gameService.setTierGroupPets(null, petPool);
    }
    // if on all pets do nothing
    if (this.formGroup.get('allPets').value) {
      return;
    }
    if (randomize) {
      // this.randomize(player);
    }
  }

  updatePlayerToy(player: Player, toy) {
    let levelControlName;
    if (player == this.player) {
      levelControlName = 'playerToyLevel';
    }
    if (player == this.opponent) {
      levelControlName = 'opponentToyLevel';
    }
    let level = Number(this.formGroup.get(levelControlName).value);
    player.toy = this.toyService.createToy(toy, player, level);
    player.originalToy = player.toy;
    this.setToyImage(player, toy);
  }

  setToyImage(player: Player, toyName: string) {
    const nameId = this.toyService.getToyNameId(toyName);
    const imageUrl = nameId ? `${TOY_ART_BASE}${nameId}.png` : '';
    if (player == this.player) {
      this.playerToyImageUrl = imageUrl;
    } else if (player == this.opponent) {
      this.opponentToyImageUrl = imageUrl;
    }
  }

  setHardToyImage(player: Player, toyName: string) {
    const nameId = this.toyService.getToyNameId(toyName);
    const imageUrl = nameId ? `${TOY_ART_BASE}${nameId}.png` : '';
    if (player == this.player) {
      this.playerHardToyImageUrl = imageUrl;
    } else if (player == this.opponent) {
      this.opponentHardToyImageUrl = imageUrl;
    }
  }

  updatePreviousShopTier(turn) {
    let tier = 1;
    if (turn > 2) {
      tier = 2;
    }
    if (turn > 4) {
      tier = 3;
    }
    if (turn > 6) {
      tier = 4;
    }
    if (turn > 8) {
      tier = 5;
    }
    if (turn > 10) {
      tier = 6;
    }
    this.gameService.setPreviousShopTier(tier);
    this.gameService.setTurnNumber(turn);
  }

  updateGoldSpent(player, opponent) {
    this.gameService.setGoldSpent(player, opponent);
  }

  updateToyLevel(player: Player, level) {
    if (player.toy) {
      player.toy.level = level;
    }
  }

  getRandomEquipment() {
    const equipment = Array.from(this.equipmentService.getInstanceOfAllEquipment().values());
    const allowAilments = this.formGroup?.get('ailmentEquipment')?.value;
    const ailments = allowAilments ? Array.from(this.equipmentService.getInstanceOfAllAilments().values()) : [];
    const options = equipment.concat(ailments);
    if (options.length === 0) {
      return null;
    }
    const idx = Math.floor(Math.random() * options.length);
    return options[idx];
  }



  simulate(count: number = 1000) {
    try {
      this.runSimulation(count);
    } catch (error) {
      console.error(error)
      window.alert('Something went wrong, please send a bug report.');
    }
  }

  runSimulation(count: number = 1000) {
    this.simulationBattleAmt = count;
    this.localStorageService.setFormStorage(this.formGroup);

    const result = this.simulationService.runSimulation(
      this.formGroup,
      count,
      this.player,
      this.opponent
    );

    this.playerWinner = result.playerWins;
    this.opponentWinner = result.opponentWins;
    this.draw = result.draws;
    this.battles = result.battles || [];
    this.battleRandomEvents = this.battles.map((battle) => this.formatRandomEvents(battle));
    this.refreshFilteredBattles();
    this.viewBattle = result.battles[0] || null;
    this.viewBattleLogs = this.viewBattle?.logs ?? [];
    this.refreshViewBattleLogRows();
    this.simulated = true;
  }



  get logs() {
    return this.logService.getLogs();
  }

  setViewBattle(battle: Battle) {
    this.viewBattle = battle;
    this.viewBattleLogs = this.viewBattle?.logs ?? [];
    this.refreshViewBattleLogRows();
  }

  refreshViewBattleLogRows() {
    this.viewBattleLogRows = this.viewBattleLogs.map((log) => ({
      message: log.message + (log.count > 1 ? ` (x${log.count})` : ''),
      classes: [
        this.getPlayerClass(log),
        log.randomEvent ? 'random-event' : '',
        log.bold ? 'bold' : ''
      ].filter(Boolean)
    }));
  }

  getDrawWidth() {
    return `${(this.losePercent + this.drawPercent)}%`;
  }

  getLoseWidth() {
    return `${this.losePercent}%`;
  }

  getPlayerClass(log: Log) {
    if (log.player == null) {
      return 'log';
    }
    if (!log.player.isOpponent) {
      return 'log-player';
    } else {
      return 'log-opponent'
    }
  }

  formatRandomEvents(battle: Battle): string {
    const randomLogs = battle.logs.filter((log) => log.randomEvent === true);
    return randomLogs.map((log) => log.message).join('<br>');
  }

  saveTeam(side: 'player' | 'opponent') {
    const result = saveTeamPreset({
      side,
      teamName: this.teamName,
      formGroup: this.formGroup,
      savedTeams: this.savedTeams,
      selectedTeamId: this.selectedTeamId,
      teamPresetsService: this.teamPresetsService
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
      initPetForms: () => this.initPetForms()
    });
  }

  private loadTeamPresets() {
    this.savedTeams = this.teamPresetsService.loadTeams();
  }

  /**
   * Randomizes both player and opponent if no player is provided.
   * @param player 
   */
  randomize(player?: Player) {

    // if button is pressed on HTML
    if (player == null) {
      if (!confirm('Are you sure you want to randomize?')) {
        return
      }
    }

    if (player) {
      player.allPets = this.formGroup.get('allPets').value;
      player.tokenPets = this.formGroup.get('tokenPets').value;
      this.randomizePlayerPets(player);
    } else {
      this.player.allPets = this.formGroup.get('allPets').value;
      this.player.tokenPets = this.formGroup.get('tokenPets').value;
      this.opponent.allPets = this.formGroup.get('allPets').value;
      this.opponent.tokenPets = this.formGroup.get('tokenPets').value;
      this.randomizePlayerPets(this.player);
      this.randomizePlayerPets(this.opponent);
    }
    if (this.formGroup) {
      this.initPetForms();
    }
    setTimeout(() => {
      this.petSelectors.forEach(selector => {
        selector.initSelector();
      })
    })
  }

  clearCache() {
    this.localStorageService.clearStorage();
    alert('Cache cleared. Refresh page to see changes.');
  }

  initModals() {
    this.customPackEditorModal = new Modal(this.customPackEditor.nativeElement);
    this.customPackEditor.nativeElement.addEventListener('hidden.bs.modal', (event) => {
      // this.formGroup.get('playerPack').setValue(this.previousPackPlayer, {emitEvent: false});
      // this.formGroup.get('opponentPack').setValue(this.previousPackOpponent, {emitEvent: false});
    })
  }

  openCustomPackEditor() {
    this.customPackEditorModal.show();
    this.formGroup.get('playerPack').setValue(this.previousPackPlayer, { emitEvent: false });
    this.formGroup.get('opponentPack').setValue(this.previousPackOpponent, { emitEvent: false });
  }

  drop(event: CdkDragDrop<string[]>, playerString: string) {
    let previousIndex = event.previousIndex;
    let currentIndex = event.currentIndex;
    if (playerString == 'player') {
      // since the array is reversed, we need to revers the indexes
      previousIndex = 4 - previousIndex;
      currentIndex = 4 - currentIndex;
    }
    let formArray = this.formGroup.get(`${playerString}Pets`) as FormArray;
    moveItemInArray(formArray.controls, previousIndex, currentIndex);
    formArray.updateValueAndValidity();
    this.refreshPetFormArrays();

    setTimeout(() => {
      // Allow Angular to update view indices before substituting
      for (let selector of this.petSelectors.toArray()) {
        selector.substitutePet();
      }
    });

  }

  resetPlayer(player: 'player' | 'opponent') {
    if (!confirm(`Are you sure you want to reset ${player}?`)) {
      return
    }
    let petSelectors = this.petSelectors.toArray().slice(player == 'player' ? 0 : 5, player == 'player' ? 5 : 10);
    for (let petSelector of petSelectors) {
      petSelector.removePet();
    }
    if (player === 'player') {
      this.formGroup.get('playerToy').setValue(null);
      this.formGroup.get('playerToyLevel').setValue(1);
      this.formGroup.get('playerHardToy').setValue(null);
      this.formGroup.get('playerHardToyLevel').setValue(1);
    } else {
      this.formGroup.get('opponentToy').setValue(null);
      this.formGroup.get('opponentToyLevel').setValue(1);
      this.formGroup.get('opponentHardToy').setValue(null);
      this.formGroup.get('opponentHardToyLevel').setValue(1);
    }
  }

  export() {
    // fizes strange bug of export failing on load
    // fixes strange bug with circular dependency
    // this.simulate();

    // added this and it is fixed?
    this.localStorageService.setFormStorage(this.formGroup);

    let calc = buildExportPayload(this.formGroup);
    // copy to clipboard
    navigator.clipboard.writeText(calc).then(() => {
      alert('Copied to clipboard');
    })
  }

  import(importVal: string, isInitialLoad: boolean = false): boolean {
    let success = false;
    try {
      const calculator = JSON.parse(importVal);

      this.applyCalculatorState(calculator);
      this.initApp();
      if (!isInitialLoad) {
        setTimeout(() => {
          if (this.petSelectors) {
            this.petSelectors.forEach((petSelector) => {
              petSelector.fixLoadEquipment();
            });
          }
        }, 0);
      }
      success = true;
    } catch (e) {
      console.error(e);
      // acceptable faliure
    }
    return success;
  }

  generateShareLink(): void {
    this.localStorageService.setFormStorage(this.formGroup);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableLink = buildShareableLink(this.formGroup, baseUrl);

    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Shareable link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link. See console for details.');
    });
  }

  refreshFilteredBattles() {
    const filter = this.formGroup.get('logFilter')?.value ?? null;
    this.filteredBattlesCache = filter == null
      ? this.battles
      : this.battles.filter((battle) => battle.winner === filter);
  }

  get winPercent() {
    return money_round(this.playerWinner / this.simulationBattleAmt * 100);
  }

  get drawPercent() {
    return money_round(this.draw / this.simulationBattleAmt * 100);
  }

  get losePercent() {
    return money_round(this.opponentWinner / this.simulationBattleAmt * 100);
  }

  get validCustomPacks() {
    let formArray = this.formGroup.get('customPacks') as FormArray;
    let validFormGroups = [];
    for (let formGroup of formArray.controls) {
      if (formGroup.valid) {
        validFormGroups.push(formGroup);
      }
    }
    return validFormGroups;
  }

  getToyIcon(toy: string): string {
    return getToyIconPath(toy) ?? '';
  }

  getSelectedTeam() {
    return this.savedTeams.find((team) => team.id === this.selectedTeamId);
  }

  getSelectedTeamName(): string {
    return this.getSelectedTeam()?.name || 'Saved teams';
  }

  getSelectedTeamPreviewIcons(): string[] {
    const pets = this.getSelectedTeam()?.pets || [];
    return pets.slice(0, 5).map((pet) => getPetIconPath(pet?.name)).filter(Boolean);
  }

  getToyOptionStyle(toy: string | null) {
    if (!toy) {
      return {};
    }
    const icon = this.getToyIcon(toy);
    return {
      'background-image': `url(${icon})`,
      'background-repeat': 'no-repeat',
      'background-size': '20px 20px',
      'background-position': 'left center',
      'padding-left': '2rem'
    };
  }

  openSelectionDialog(type: SelectionType, side: 'player' | 'opponent' | 'none') {
    this.selectionType = type;
    this.selectionSide = side;
    this.showSelectionDialog = true;
  }

  onItemSelected(item: any) {
    if (!this.selectionSide || this.selectionSide === 'none') {
      if (this.selectionType === 'team') {
        this.selectedTeamId = typeof item === 'string' ? item : (item?.id || item?.name || '');
      }
      this.showSelectionDialog = false;
      this.selectionSide = 'none';
      return;
    }

    const side = this.selectionSide;
    const type = this.selectionType;

    if (type === 'pack') {
      const packName = item?.name || item;
      if (side === 'player') {
        this.formGroup.get('playerPack').setValue(packName);
      } else {
        this.formGroup.get('opponentPack').setValue(packName);
      }
    } else if (type === 'toy') {
      const toyName = item?.name || item || null;
      if (side === 'player') {
        this.formGroup.get('playerToy').setValue(toyName);
      } else {
        this.formGroup.get('opponentToy').setValue(toyName);
      }
    } else if (type === 'hard-toy') {
      const toyName = item?.name || item || null;
      if (side === 'player') {
        this.formGroup.get('playerHardToy').setValue(toyName);
      } else {
        this.formGroup.get('opponentHardToy').setValue(toyName);
      }
    } else if (type === 'team') {
      this.selectedTeamId = typeof item === 'string' ? item : (item?.id || item?.name || '');
    }

    this.showSelectionDialog = false;
    this.selectionSide = 'none';
  }

  getPackIconPath(packName?: string): string | null {
    return getPackIconPath(packName);
  }

  onPackImageError(side: 'player' | 'opponent') {
    if (side === 'player') {
      this.playerPackImageBroken = true;
    } else {
      this.opponentPackImageBroken = true;
    }
  }

  resetPackImageError(side: 'player' | 'opponent', packName: string) {
    if (side === 'player') {
      this.playerPackImageBroken = false;
    } else {
      this.opponentPackImageBroken = false;
    }
  }

  incrementToyLevel(side: 'player' | 'opponent') {
    const controlName = side === 'player' ? 'playerToyLevel' : 'opponentToyLevel';
    const currentLevel = this.formGroup.get(controlName).value;
    if (currentLevel < 3) {
      this.formGroup.get(controlName).setValue(currentLevel + 1);
    }
  }

  decrementToyLevel(side: 'player' | 'opponent') {
    const controlName = side === 'player' ? 'playerToyLevel' : 'opponentToyLevel';
    const currentLevel = this.formGroup.get(controlName).value;
    if (currentLevel > 1) {
      this.formGroup.get(controlName).setValue(currentLevel - 1);
    }
  }

  removeHardToy(side: 'player' | 'opponent') {
    const controlName = side === 'player' ? 'playerHardToy' : 'opponentHardToy';
    this.formGroup.get(controlName).setValue(null);
  }

  getToyIconPath(toyName?: string): string | null {
    return getToyIconPath(toyName);
  }

}
